"""Create browser-friendly H.264/AAC copy of the carrot harvest video."""
import os
import subprocess
import sys

try:
    import imageio_ffmpeg as iio
except ImportError:
    print("Run: pip install imageio-ffmpeg")
    sys.exit(1)

ROOT = r"d:\AIWorks\SAFI"
MEDIA = os.path.join(ROOT, "website", "assets", "media")
SRC = os.path.join(MEDIA, "VID-20261011-WA0000.mp4")
ALT = os.path.join(ROOT, "VID-20261011-WA0000.mp4")
DST = os.path.join(MEDIA, "VID-20261011-WA0000-web.mp4")

if not os.path.isfile(SRC) and os.path.isfile(ALT):
    os.makedirs(MEDIA, exist_ok=True)
    import shutil

    shutil.copy2(ALT, SRC)

if not os.path.isfile(SRC):
    print("Missing source:", SRC)
    sys.exit(1)

ffmpeg = iio.get_ffmpeg_exe()
cmd = [
    ffmpeg,
    "-y",
    "-i",
    SRC,
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-level",
    "4.0",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    DST,
]
subprocess.run(cmd, check=True)
print("Wrote", DST, os.path.getsize(DST), "bytes")
