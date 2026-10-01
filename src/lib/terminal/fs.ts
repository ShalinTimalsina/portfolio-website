import { INode, FileType } from "./types"

export class FileSystemError extends Error {
  constructor(public code: "ENOENT" | "ENOTDIR" | "EISDIR" | "EACCES" | "EEXIST", message: string) {
    super(message)
    this.name = "FileSystemError"
  }
}

export function createNode(name: string, type: FileType, readOnly = false, content?: string): INode {
  return {
    name,
    type,
    readOnly,
    content: content || "",
    permissions: type === "dir" ? "drwxr-xr-x" : type === "exec" ? "-rwxr-xr-x" : "-rw-r--r--",
    mtime: Date.now(),
    children: type === "dir" ? {} : undefined
  }
}

export const initialFS: INode = {
  name: "",
  type: "dir",
  readOnly: true,
  permissions: "drwxr-xr-x",
  mtime: Date.now(),
  children: {
    "bin": {
      name: "bin", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
      children: {
        "bash": createNode("bash", "exec", true),
        "ls": createNode("ls", "exec", true),
        "cat": createNode("cat", "exec", true),
        "grep": createNode("grep", "exec", true)
      }
    },
    "dev": {
      name: "dev", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
      children: {
        "null": createNode("null", "file", false, ""),
        "zero": createNode("zero", "file", true, "")
      }
    },
    "etc": {
      name: "etc", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
      children: {
        "passwd": createNode("passwd", "file", true, "root:x:0:0:root:/root:/bin/bash\nshalin:x:1000:1000:Shalin:/home/shalin:/bin/bash"),
        "shadow": createNode("shadow", "file", true, "root:!:19000:0:99999:7:::\nshalin:!:19000:0:99999:7:::"),
        "os-release": createNode("os-release", "file", true, 'PRETTY_NAME="Ubuntu 22.04.1 LTS"\nNAME="Ubuntu"\nVERSION_ID="22.04"')
      }
    },
    "root": {
      name: "root", type: "dir", readOnly: true, permissions: "drwx------", mtime: Date.now(),
      children: {}
    },
    "tmp": {
      name: "tmp", type: "dir", readOnly: false, permissions: "drwxrwxrwt", mtime: Date.now(),
      children: {}
    },
    "var": {
      name: "var", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
      children: {
        "log": {
          name: "log", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
          children: {
            "syslog": createNode("syslog", "file", true, "Oct 1 12:00:01 cloud systemd: Started ShalinOS.\nOct 1 12:00:05 cloud kernel: [    0.000000] Linux version 6.1.0-1014-aws"),
            "auth.log": createNode("auth.log", "file", true, "Oct 1 12:01:00 cloud sshd[123]: Accepted publickey for shalin")
          }
        }
      }
    },
    "home": {
      name: "home", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
      children: {
        "shalin": {
          name: "shalin", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
          children: {
            ".bash_history": createNode(".bash_history", "file", false, "ls -la\nwhoami\nneofetch"),
            ".bashrc": createNode(".bashrc", "file", true, "# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PATH=$PATH:/usr/local/bin\n"),
            "portfolio": {
              name: "portfolio", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(),
              children: {
                "projects": {
                  name: "projects", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(), linkedSection: "work",
                  children: {
                    "terraform-ci-cd": createNode("terraform-ci-cd", "exec", true),
                    "nrb-redesign": createNode("nrb-redesign", "exec", true),
                    "vote-app": createNode("vote-app", "exec", true),
                    "cloudway-lms": createNode("cloudway-lms", "exec", true)
                  }
                },
                "skills": {
                  name: "skills", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(), linkedSection: "skills",
                  children: {
                    "daily.md": createNode("daily.md", "file", true, "[ Markdown Content: daily.md ]"),
                    "working.md": createNode("working.md", "file", true, "[ Markdown Content: working.md ]"),
                    "learning.md": createNode("learning.md", "file", true, "[ Markdown Content: learning.md ]")
                  }
                },
                "contact": {
                  name: "contact", type: "dir", readOnly: true, permissions: "drwxr-xr-x", mtime: Date.now(), linkedSection: "contact",
                  children: {
                    "send-email.sh": createNode("send-email.sh", "exec", true, "#!/bin/bash\necho 'Opening secure comms channel...'"),
                    "socials.txt": createNode("socials.txt", "file", true, "LinkedIn: linkedin.com/in/shalin-timalsina\nGitHub: github.com/ShalinTimalsina")
                  }
                },
                "about.txt": createNode("about.txt", "file", true, "Shalin Timalsina. Cloud & DevOps Engineer.\nBuilding infrastructure that scales, one block at a time."),
                "resume.pdf": createNode("resume.pdf", "file", true, "BINARY_DATA")
              }
            }
          }
        }
      }
    }
  }
}

export const HOME_DIR = "/home/shalin"

export function normalizePath(path: string, cwd: string): string {
  let resolvedCwd = cwd
  if (resolvedCwd.startsWith("~")) {
    resolvedCwd = resolvedCwd.replace(/^~/, HOME_DIR)
  }

  if (!path) return resolvedCwd
  
  let p = path
  if (p.startsWith("~")) {
    p = p.replace(/^~/, HOME_DIR)
  }
  
  if (!p.startsWith("/")) {
    p = resolvedCwd + (resolvedCwd.endsWith("/") ? "" : "/") + p
  }

  // Resolve . and ..
  const parts = p.split("/").filter(part => part !== "" && part !== ".")
  const resolved: string[] = []
  
  for (const part of parts) {
    if (part === "..") {
      resolved.pop()
    } else {
      resolved.push(part)
    }
  }

  return "/" + resolved.join("/")
}

export function resolveNode(root: INode, path: string, cwd: string): INode {
  const normalized = normalizePath(path, cwd)
  if (normalized === "/") return root

  const parts = normalized.split("/").filter(Boolean)
  let current = root

  for (const part of parts) {
    if (current.type !== "dir" || !current.children) {
      throw new FileSystemError("ENOTDIR", `Not a directory: ${part}`)
    }
    const next = current.children[part]
    if (!next) {
      throw new FileSystemError("ENOENT", `No such file or directory: ${normalized}`)
    }
    current = next
  }

  return current
}

export function resolveParentAndName(root: INode, path: string, cwd: string): { parent: INode, name: string } {
  const normalized = normalizePath(path, cwd)
  if (normalized === "/") throw new FileSystemError("EACCES", "Cannot modify root")

  const parts = normalized.split("/").filter(Boolean)
  const name = parts.pop()!
  
  const parentPath = "/" + parts.join("/")
  const parent = resolveNode(root, parentPath, cwd)
  
  if (parent.type !== "dir") {
    throw new FileSystemError("ENOTDIR", `Not a directory: ${parentPath}`)
  }
  
  return { parent, name }
}
