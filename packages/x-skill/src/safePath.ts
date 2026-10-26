import fs from 'fs';
import path from 'path';

export function validateEntryName(name: string): void {
  if (
    typeof name !== 'string' ||
    !/^[a-zA-Z0-9_.-]+$/.test(name) ||
    name.includes('..') ||
    name.endsWith('.') ||
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name)
  ) {
    throw new Error(`Unsafe file or skill name: ${name}`);
  }
}

export function ensureDirectory(directory: string): void {
  // Reject an existing or dangling directory symlink before mkdir.
  let current = path.resolve(directory);
  while (!fs.existsSync(current)) {
    const stat = fs.lstatSync(current, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) throw new Error(`Symbolic link is not allowed: ${current}`);
    current = path.dirname(current);
  }
  if (!fs.lstatSync(current).isDirectory()) {
    throw new Error(`Not a directory: ${current}`);
  }
  fs.mkdirSync(directory, { recursive: true });
  if (!fs.lstatSync(directory).isDirectory()) {
    throw new Error(`Not a directory: ${directory}`);
  }
}

export function safeChildPath(root: string, name: string): string {
  validateEntryName(name);
  const resolvedRoot = path.resolve(root);
  const child = path.resolve(resolvedRoot, name);
  const relative = path.relative(resolvedRoot, child);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path escapes its root: ${name}`);
  }
  const stat = fs.lstatSync(child, { throwIfNoEntry: false });
  if (stat?.isSymbolicLink()) throw new Error(`Symbolic link is not allowed: ${child}`);
  return child;
}

export function copyDirectory(src: string, dest: string): void {
  const source = fs.realpathSync(src);
  ensureDirectory(path.dirname(dest));
  const target = path.join(fs.realpathSync(path.dirname(dest)), path.basename(dest));
  const relative = path.relative(source, target);
  if (
    !relative ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  ) {
    throw new Error(`Cannot copy directory into itself: ${src} -> ${dest}`);
  }
  if (!fs.lstatSync(src).isDirectory()) throw new Error(`Not a directory: ${src}`);
  ensureDirectory(dest);

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const sourcePath = safeChildPath(src, entry.name);
    const targetPath = safeChildPath(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath, fs.constants.COPYFILE_EXCL);
    } else {
      throw new Error(`Unsupported file type: ${sourcePath}`);
    }
  }
}
