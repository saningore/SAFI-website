"""Map embedded images in SAFI Review 2.docx to nearest section text."""
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

DOCX = Path(__file__).resolve().parents[2] / "SAFI Review 2.docx"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
EMBED = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"

with zipfile.ZipFile(DOCX) as z:
    relmap = {
        r.get("Id"): r.get("Target", "").replace("media/", "")
        for r in ET.fromstring(z.read("word/_rels/document.xml.rels"))
        if r.get("Id")
    }
    root = ET.fromstring(z.read("word/document.xml"))

paras = root.findall(f".//{W}p")
history: list[str] = []
for p in paras:
    text = "".join(t.text or "" for t in p.iter(f"{W}t")).strip()
    blip = None
    for el in p.iter():
        if el.tag.split("}")[-1] == "blip":
            blip = relmap.get(el.get(EMBED))
            break
    if text:
        history.append(text)
    if blip:
        print(f"{blip}\t<= {' | '.join(history[-3:])}")
