# Termi-log

Terminal journaling TUI built with [OpenTUI](https://github.com/opentui/opentui) and [Bun](https://bun.sh).

## Requirements

- [Bun](https://bun.sh) (latest)
- **Windows** or **Linux** only (macOS is not supported yet)

## Install & run

```bash
bun install -g @soham_chitale/termi-log

termilog
```

## Keyboard shortcuts

| Key | Action                             |
| --- | ---------------------------------- |
| `h` | Home                               |
| `j` | Journal editor                     |
| `d` | Dashboard (streak, activity, mood) |
| `q` | Quit                               |
| `/` | Toggle debug console               |

On the **dashboard**:

| Key | Action                           |
| --- | -------------------------------- |
| `w` | Mood chart — this week (Sun–Sat) |
| `m` | Mood chart — last 30 days        |
| `r` | Refresh dashboard data           |

## Where your data lives

Journals are Markdown files; metadata is stored in a local index file.

| Platform | Journal files                 | Index                            |
| -------- | ----------------------------- | -------------------------------- |
| Windows  | `%USERPROFILE%\Termilog\*.md` | `%APPDATA%\.termilog\index.json` |
| Linux    | `~/terminilog/*.md`           | `~/.config/termlog/index.json`   |

The app reconciles the index with files on disk at startup. If the journal folder is missing, the index is **not** modified.

## Tips

- Journal titles must not contain characters invalid in filenames (`\ / : * ? " < > \|`, etc.).
- Mood on the dashboard reflects the mood saved with each journal entry (last save per day).
