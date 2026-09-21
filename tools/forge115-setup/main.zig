// FORGE 115 Windows installer — file copy only (no Steam inject, no VAC bypass).
const std = @import("std");
const WINAPI = std.os.windows.WINAPI;
const BOOL = i32;
const DWORD = u32;
const HANDLE = ?*anyopaque;

extern "user32" fn MessageBoxA(hWnd: ?*anyopaque, lpText: [*:0]const u8, lpCaption: [*:0]const u8, uType: u32) callconv(WINAPI) i32;
extern "kernel32" fn GetEnvironmentVariableA(lpName: [*:0]const u8, lpBuffer: [*]u8, nSize: DWORD) callconv(WINAPI) DWORD;
extern "kernel32" fn CreateDirectoryA(lpPathName: [*:0]const u8, lpSecurity: ?*anyopaque) callconv(WINAPI) BOOL;
extern "kernel32" fn CreateFileA(
    lpFileName: [*:0]const u8,
    dwDesiredAccess: DWORD,
    dwShareMode: DWORD,
    lpSecurity: ?*anyopaque,
    dwCreationDisposition: DWORD,
    dwFlagsAndAttributes: DWORD,
    hTemplate: HANDLE,
) callconv(WINAPI) HANDLE;
extern "kernel32" fn WriteFile(hFile: HANDLE, lpBuffer: [*]const u8, nBytes: DWORD, lpWritten: *DWORD, lpOverlapped: ?*anyopaque) callconv(WINAPI) BOOL;
extern "kernel32" fn CloseHandle(h: HANDLE) callconv(WINAPI) BOOL;
extern "kernel32" fn GetLastError() callconv(WINAPI) DWORD;

const MB_OK: u32 = 0;
const MB_ICONINFORMATION: u32 = 0x40;
const MB_ICONERROR: u32 = 0x10;
const GENERIC_WRITE: DWORD = 0x40000000;
const CREATE_ALWAYS: DWORD = 2;
const FILE_ATTRIBUTE_NORMAL: DWORD = 0x80;
const INVALID_HANDLE_VALUE: usize = 0xFFFF_FFFF_FFFF_FFFF;

const File = struct { rel: []const u8, bytes: []const u8 };

const FILES = [_]File{
    .{ .rel = "scripts\\zm\\forge115\\_menu.gsc", .bytes = @embedFile("embed/_menu.gsc") },
    .{ .rel = "scripts\\zm\\forge115\\_actions.gsc", .bytes = @embedFile("embed/_actions.gsc") },
    .{ .rel = "scripts\\zm\\forge115\\_config.gsc", .bytes = @embedFile("embed/_config.gsc") },
    .{ .rel = "scripts\\zm\\forge115\\_hooks.gsc", .bytes = @embedFile("embed/_hooks.gsc") },
    .{ .rel = "scripts\\zm\\forge115\\_clientids.gsc", .bytes = @embedFile("embed/_clientids.gsc") },
    .{ .rel = "scripts\\zm\\forge115\\forge115-config.json", .bytes = @embedFile("embed/forge115-config.json") },
    .{ .rel = "maps\\mp\\gametypes_zm\\_clientids.gsc", .bytes = @embedFile("embed/_clientids.gsc") },
    .{ .rel = "maps\\mp\\gametypes_zm\\_shellshock.gsc", .bytes = @embedFile("embed/_shellshock.gsc") },
};

fn alert(text: [:0]const u8, is_err: bool) void {
    const flags: u32 = MB_OK | (if (is_err) MB_ICONERROR else MB_ICONINFORMATION);
    _ = MessageBoxA(null, text.ptr, "FORGE 115", flags);
}

fn makeDirs(path: []const u8) void {
    var buf: [400]u8 = undefined;
    if (path.len >= buf.len) return;
    var i: usize = 0;
    while (i < path.len) : (i += 1) {
        buf[i] = path[i];
        if (path[i] == '\\' and i > 2) {
            buf[i] = 0;
            _ = CreateDirectoryA(@ptrCast(&buf), null);
            buf[i] = '\\';
        }
    }
}

fn join3(out: *[400]u8, a: []const u8, b: []const u8) ?[:0]u8 {
    if (a.len + 1 + b.len + 1 >= out.len) return null;
    var n: usize = 0;
    for (a) |c| {
        out[n] = c;
        n += 1;
    }
    if (n > 0 and out[n - 1] != '\\') {
        out[n] = '\\';
        n += 1;
    }
    for (b) |c| {
        out[n] = c;
        n += 1;
    }
    out[n] = 0;
    return out[0..n :0];
}

pub fn main() void {
    var local_buf: [260]u8 = undefined;
    const n = GetEnvironmentVariableA("LOCALAPPDATA", &local_buf, local_buf.len);
    if (n == 0 or n >= local_buf.len) {
        alert("Could not read %LOCALAPPDATA%.", true);
        return;
    }
    const local = local_buf[0..n];

    var root_buf: [400]u8 = undefined;
    const root = join3(&root_buf, local, "Plutonium\\storage\\t6") orelse {
        alert("Path too long.", true);
        return;
    };

    var copied: usize = 0;
    for (FILES) |f| {
        var full_buf: [400]u8 = undefined;
        const full = join3(&full_buf, root, f.rel) orelse {
            alert("A script path was too long.", true);
            return;
        };
        makeDirs(full);
        const h = CreateFileA(full.ptr, GENERIC_WRITE, 0, null, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, null);
        if (h == null or @intFromPtr(h) == INVALID_HANDLE_VALUE) {
            var msg: [420]u8 = undefined;
            const m = std.fmt.bufPrintZ(&msg, "Could not write:\n{s}\nError {d}\nInstall Plutonium first, then run this again.", .{ full, GetLastError() }) catch "Could not write a file. Install Plutonium first.";
            alert(m, true);
            return;
        }
        var written: DWORD = 0;
        const ok = WriteFile(h, f.bytes.ptr, @intCast(f.bytes.len), &written, null);
        _ = CloseHandle(h);
        if (ok == 0 or written != f.bytes.len) {
            alert("Write failed. Close Plutonium and try again.", true);
            return;
        }
        copied += 1;
    }

    var ok_buf: [900]u8 = undefined;
    const ok = std.fmt.bufPrintZ(&ok_buf,
        \\Installed {d} files into:
        \\{s}
        \\
        \\This only copies files. It does not inject into Steam.
        \\
        \\Next:
        \\1. Open Plutonium
        \\2. Black Ops II  ->  Zombies
        \\3. PRIVATE match as HOST
        \\4. Look for: FORGE 115 loaded
        \\5. Press N to open the menu
    , .{ copied, root }) catch "Installed. Open Plutonium, private Zombies as host.";
    alert(ok, false);
}
