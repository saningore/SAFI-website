"""Replace legacy stock paths with approved people/savanna photography."""
import pathlib
import re

ROOT = pathlib.Path(r"d:\AIWorks\SAFI\website")
REPLACEMENTS = [
    ("assets/images/image10.jpeg", "assets/images/people/research-landscape-wide.png"),
    ("assets/images/image11.jpeg", "assets/images/people/savanna-harmattan-village.png"),
    ("assets/images/image8.jpeg", "assets/images/people/leadership-group-five.png"),
    ("assets/images/image1.jpeg", "assets/images/people/field-palms-research-site.png"),
    ("assets/images/image3.jpeg", "assets/images/people/women-community-procession.png"),
    ("assets/images/image6.jpeg", "assets/images/people/goats-pasture.png"),
    ("assets/images/image4.jpeg", "assets/images/people/cultural-gathering-wide.png"),
    ("assets/images/image12.jpeg", "assets/images/people/women-carrying-pots.png"),
    ("assets/images/image9.png", "assets/images/people/doum-palms-vertical.png"),
    ("assets/images/image7.jpeg", "assets/images/people/savanna-aerial-green.png"),
    ("assets/images/image5.jpeg", "assets/images/people/rural-settlement-motorcycle.png"),
]

for path in ROOT.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        print("updated", path.name)
