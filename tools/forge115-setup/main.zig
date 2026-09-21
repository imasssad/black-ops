// FORGE 115 Windows installer
// Copies bundled GSC into Plutonium T6 storage.
// File copy only — does not inject into Steam, does not bypass VAC.
const std = @import("std");

extern "user32" fn MessageBoxA(
    hWnd: ?*anyopaque,
    lpText: [*:0]const u8,
    lpCaption: [*:0]const u8,
    uType: u32,
) callconv(std.os.windows.WINAPI) i32;

const MB_OK: u32 = 0;
const MB_ICONINFORMATION: u32 = 0x40;
const MB_ICONERROR: u32 = 0x10;

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

fn alert(title: [:0]const u8, text: [:0]const u8, is_err: bool) void {
    const flags: u32 = MB_OK | (if (is_err) MB_ICONERROR else MB_ICONINFORMATION);
    _ = MessageBoxA(null, text.ptr, title.ptr, flags);
}

fn parentDir(path: []const u8) []const u8 {
    var i: usize = path.len;
    while (i > 0) {
        i -= 1;
        if (path[i] == '\\' or path[i] == '/') return path[0..i];
    }
    return path;
}

pub fn main() void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const alloc = gpa.allocator();

    const local = std.process.getEnvVarOwned(alloc, "LOCALAPPDATA") catch {
        alert("FORGE 115", "Could not read LOCALAPPDATA.", true);
        return;
    };
    defer alloc.free(local);

    const root = std.fs.path.join(alloc, &[_][]const u8{ local, "Plutonium", "storage", "t6" }) catch {
        alert("FORGE 115", "Out of memory.", true);
        return;
    };
    defer alloc.free(root);

    var copied: usize = 0;
    for (FILES) |f| {
        const full = std.fs.path.join(alloc, &[_][]const u8{ root, f.rel }) catch {
            alert("FORGE 115", "Out of memory while joining path.", true);
            return;
        };
        defer alloc.free(full);
        std.fs.cwd().makePath(parentDir(full)) catch {
            alert("FORGE 115", "Could not create Plutonium folders.\nInstall Plutonium first: plutonium.pw", true);
            return;
        };
        const file = std.fs.createFileAbsolute(full, .{}) catch {
            var msg_buf: [512]u8 = undefined;
            const msg = std.fmt.bufPrintZ(&msg_buf, "Could not write:\n{s}", .{full}) catch "Could not write a script file.";
            alert("FORGE 115", msg, true);
            return;
        };
        defer file.close();
        file.writeAll(f.bytes) catch {
            alert("FORGE 115", "Write failed. Close Plutonium and try again.", true);
            return;
        };
        copied += 1;
    }

    var ok_buf: [900]u8 = undefined;
    const ok = std.fmt.bufPrintZ(&ok_buf,
        \\Installed {d} files into:
        \\{s}
        \\
        \\This is a file copy only. It does not inject into Steam.
        \\
        \\Next:
        \\1. Open Plutonium
        \\2. Black Ops II  ->  Zombies
        \\3. Start a PRIVATE match as HOST
        \\4. You should see:  FORGE 115 loaded
        \\5. Press N (Action Slot 1) to open the menu
        \\
        \\Official Steam / public matchmaking will not load this.
    , .{ copied, root }) catch "Installed. Open Plutonium, private Zombies as host.";
    alert("FORGE 115", ok, false);
}
