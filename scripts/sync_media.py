"""Copy WhatsApp assets into website media folders (run when new assets arrive)."""
import os
import re
import shutil

SRC = r"C:\Users\saman\.cursor\projects\d-AIWorks-SAFI\assets"
ROOT_VIDEO = r"d:\AIWorks\SAFI\VID-20261011-WA0000.mp4"
MEDIA = r"d:\AIWorks\SAFI\website\assets\media"
DEST = os.path.join(MEDIA, "VID-20261011-WA0000.mp4")

os.makedirs(MEDIA, exist_ok=True)

if os.path.isfile(ROOT_VIDEO):
    shutil.copy2(ROOT_VIDEO, DEST)
    print("Copied from project root:", ROOT_VIDEO)

if os.path.isdir(SRC):
    for name in os.listdir(SRC):
        lower = name.lower()
        if not lower.endswith(".mp4"):
            continue
        if "wa0000" in lower or "vid-20261011" in lower:
            shutil.copy2(os.path.join(SRC, name), DEST)
            print("Copied video:", name, "->", DEST)
            break
