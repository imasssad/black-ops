// FORGE 115 script deployer — copies GSC into Plutonium T6 storage.
// This is a file copy. It does not inject into a running Steam process,
// does not patch memory, and does not bypass VAC.
using System;
using System.IO;

static class Forge115Loader
{
    static int Main(string[] args)
    {
        var source = args.Length > 0
            ? args[0]
            : Path.Combine(AppContext.BaseDirectory, "gsc");
        var dest = args.Length > 1
            ? args[1]
            : Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Plutonium", "storage", "t6", "scripts", "zm", "forge115");

        if (!Directory.Exists(source))
        {
            Console.Error.WriteLine("Missing GSC folder: " + source);
            Console.Error.WriteLine("Download the pack from the FORGE 115 Source tab first.");
            return 1;
        }

        Directory.CreateDirectory(dest);
        var copied = 0;
        foreach (var file in Directory.EnumerateFiles(source, "*.gsc", SearchOption.AllDirectories))
        {
            var rel = Path.GetRelativePath(source, file);
            var target = Path.Combine(dest, rel);
            Directory.CreateDirectory(Path.GetDirectoryName(target)!);
            File.Copy(file, target, overwrite: true);
            Console.WriteLine("wrote " + target);
            copied++;
        }
        Console.WriteLine("Copied " + copied + " scripts. Launch a private T6 Zombies match as host.");
        return 0;
    }
}
