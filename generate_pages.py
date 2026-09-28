"""Generate SAFI inner pages from content document."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))


def page_head(title, desc, page_id):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{desc}">
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="inner-page">
  <div id="site-header"></div>
  <main id="main">'''


def page_foot(page_id):
    return f'''
  </main>
  <div id="site-footer"></div>
  <script src="js/layout.js" data-page="{page_id}"></script>
  <script src="js/main.js"></script>
</body>
</html>'''


def page_hero(title, lead, bc_parts, image=None, badge=None):
    cls = "page-hero header-solid"
    img_block = ""
    if image:
        cls += " has-image"
        img_block = f'<div class="page-hero-bg"><img src="{image}" alt=""></div><div class="page-hero-overlay"></div>'
    badge_html = f'<span class="status-badge status-proposed">{badge}</span>' if badge else ""
    bc = "".join(bc_parts)
    return f'''
    <section class="{cls}">
      {img_block}
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a>{bc}</nav>
        {badge_html}
        <h1>{title}</h1>
        <p class="lead">{lead}</p>
      </div>
    </section>'''


def content_page(body, sidebar=None):
    side = ""
    if sidebar:
        links = "".join(
            f'<li><a href="{h}"{" class=\"active\"" if a else ""}>{t}</a></li>'
            for t, h, a in sidebar
        )
        side = f'<aside class="page-sidebar"><h4>On this section</h4><ul>{links}</ul></aside>'
    return f'''
    <section class="page-content">
      <div class="container page-layout">
        <div class="content-body">{body}</div>
        {side}
      </div>
    </section>'''


def cta(text, link, label):
    intro = f'<p style="margin-bottom:1.5rem;">{text}</p>' if text else ""
    return f'''
    <section class="cta-band"><div class="container">{intro}<a href="{link}" class="btn btn-primary">{label}</a></div></section>'''


def write(name, content):
    path = os.path.join(BASE, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Wrote", name)


# --- ABOUT ---
write(
    "about.html",
    page_head(
        "About SAFI | African Research and Savanna Futures",
        "Discover SAFI's mission, values and Ghana-based approach to African-led research, innovation and equitable partnerships.",
        "about",
    )
    + page_hero(
        "An African institute with global connections",
        "The Savannah Futures Institute is an independent, not-for-profit research, innovation and policy-engagement institute based in Accra, Ghana.",
        [' <span>&rsaquo;</span> <span>About SAFI</span>'],
        "assets/images/image8.jpeg",
    )
    + content_page(
        """
<p class="lead">Our focus is the future of Africa's savanna regions and their connections with drylands, grasslands, wetlands, river basins and growing towns and cities.</p>
<p>We are developing an interdisciplinary institution that brings scientific research into dialogue with indigenous knowledge and practical experience. Our research agenda starts with African priorities and seeks partnerships that build lasting capability within African institutions and communities.</p>
<h2>Our vision</h2>
<p>Healthy landscapes, healthy people, peaceful societies, thriving cultures and food-secure economies across Africa's savannas, contributing knowledge and solutions for resilient societies worldwide.</p>
<h2>Our mission</h2>
<p>To generate and connect African-led research, data, innovation and indigenous knowledge; turn evidence into useful policy and investment options; strengthen people and institutions; and build equitable partnerships for resilient savanna futures.</p>
<h2>How we work</h2>
<p>We frame research questions with the people who will use the findings. We bring together environmental, health, social, economic and cultural evidence to understand interacting risks. Where resources and partnerships allow, we will test responses through community-based research sites, living labs and policy dialogues, then assess what can be adapted elsewhere.</p>
<div class="info-box"><p><strong>A living lab</strong> is a setting where researchers and users develop and test ideas together. <strong>A policy lab</strong> brings evidence and decision-makers together to explore workable choices. <strong>Observatories</strong> track change over time. These are planned delivery approaches, developed in stages as programmes become ready.</p></div>
<h2>What guides us</h2>
<ul>
<li><strong>Scientific integrity</strong> — careful methods, honest interpretation and openness about uncertainty.</li>
<li><strong>African leadership</strong> — research questions and benefits grounded in African priorities.</li>
<li><strong>Equitable partnership</strong> — clear agreements on responsibilities, resources, data and recognition.</li>
<li><strong>Respect for indigenous knowledge</strong> — consent, attribution and appropriate control over access and use.</li>
</ul>
<h2>Where we work</h2>
<p>Ghana is our institutional starting point. Our strategy is to build strong place-based programmes before extending comparative work across West Africa and other African savanna regions. International partnerships will connect this work with relevant experience in Australia, Asia and the Americas. These relationships are a direction for growth, not a claim of existing overseas offices.</p>
<h2>Legal identity</h2>
<p>The Savannah Futures Institute is registered in Ghana as a Company Limited by Guarantee and operates as a not-for-profit research and innovation organisation.</p>
""",
        [
            ("About SAFI", "about.html", True),
            ("People", "people.html", False),
            ("Governance", "governance.html", False),
            ("Research Centres", "research.html", False),
        ],
    )
    + cta("Meet our people and explore governance.", "people.html", "People & governance")
    + page_foot("about"),
)

write(
    "people.html",
    page_head(
        "People | The Savannah Futures Institute",
        "Meet SAFI's confirmed team members and explore their expertise, responsibilities and contributions.",
        "about-people",
    )
    + page_hero(
        "People connecting research with practice",
        "SAFI is building a team that brings research expertise together with policy, professional practice and community knowledge.",
        [' <span>&rsaquo;</span> <a href="about.html">About</a>', ' <span>&rsaquo;</span> <span>People</span>'],
    )
    + """
    <section class="page-content"><div class="container"><div class="content-body">
      <p>Our model combines core leadership, centre specialists, fellows and programme partners. The People directory introduces confirmed members of the Institute and their responsibilities. Profiles explain research interests, relevant experience and approved professional affiliations.</p>
      <div class="team-notice reveal" style="margin-top:2rem;">
        <h3 style="font-family:var(--font-display);font-size:1.5rem;color:var(--color-primary-dark);margin-bottom:1rem;">Team profiles coming soon</h3>
        <p>Confirmed appointments, biographies and photographs will be published here once approved by the Executive Director. Only appointed people will be shown — proposed advisers will not be listed as appointed.</p>
      </div>
    </div></div></section>
"""
    + cta("Contact SAFI about governance or a concern.", "contact.html", "Contact us")
    + page_foot("about-people"),
)

write(
    "governance.html",
    page_head(
        "Governance and Research Integrity | SAFI",
        "Learn about SAFI's governance approach, research integrity, knowledge rights and published institutional policies.",
        "about-governance",
    )
    + page_hero(
        "Governance and accountability",
        "SAFI's governance approach is designed to protect its mission, support scientific quality and make leadership accountable.",
        [' <span>&rsaquo;</span> <a href="about.html">About</a>', ' <span>&rsaquo;</span> <span>Governance</span>'],
    )
    + content_page(
        """
<h2>Institutional model</h2>
<p>The institutional model provides for governing-board oversight, executive management, research and impact review, and community and policy input into major programmes. Details of constituted bodies and confirmed appointments will be published as they are approved.</p>
<h2>Research integrity</h2>
<p>Our commitments include careful methods, honest interpretation, ethical review where required and disclosure of material interests. Research partnerships should establish responsibilities, publication arrangements and appropriate ways to share findings.</p>
<h2>Knowledge rights and responsible data use</h2>
<p>We seek clear agreements on consent, attribution, authorship, ownership, access and benefits. Open sharing is valuable where appropriate; personal, sensitive and culturally restricted information requires suitable protection.</p>
<h2>Fair participation and safe engagement</h2>
<p>SAFI's approach seeks equitable participation and respectful treatment across its research and learning activities. We aim to make concerns and complaints possible through accessible, clearly explained channels.</p>
<h2>Policies and institutional reporting</h2>
<p>This section will provide approved institutional policies and reports as they become available, including research ethics, safeguarding, conflicts of interest, financial accountability and data governance. Publication will make clear which documents are in force and when they were last reviewed.</p>
""",
        [
            ("About SAFI", "about.html", False),
            ("People", "people.html", False),
            ("Governance", "governance.html", True),
        ],
    )
    + cta("Contact SAFI about governance or a concern.", "contact.html", "Contact us")
    + page_foot("about-governance"),
)

# --- RESEARCH OVERVIEW ---
write(
    "research.html",
    page_head(
        "Research Centres | The Savannah Futures Institute",
        "Explore SAFI's five connected research centres, from climate and health to food systems, peace and indigenous knowledge.",
        "research",
    )
    + page_hero(
        "Research for connected savanna futures",
        "SAFI's five centres provide specialist homes for research while collaborating across shared programmes.",
        [' <span>&rsaquo;</span> <span>Research Centres</span>'],
        "assets/images/image10.jpeg",
    )
    + """
    <section class="page-content"><div class="container">
      <div class="content-body reveal">
        <p class="lead">Their development is phased, with activities shaped by leadership, partnerships and resources. Four shared platforms support data, policy, finance, learning and international collaboration.</p>
      </div>
      <div class="card-grid card-grid-5" style="margin-top:2rem;">
        <a href="research-climate-landscapes.html" class="centre-card reveal"><img src="assets/images/image10.jpeg" alt="Climate and landscapes"><div class="centre-card-body"><h3>Climate, Environment &amp; Landscape Futures</h3><p>Climate, ecosystems, water, biodiversity and landscape stewardship.</p><span class="card-link">Explore →</span></div></a>
        <a href="research-population-health.html" class="centre-card reveal"><img src="assets/images/image1.jpeg" alt="Population health"><div class="centre-card-body"><h3>Population Health Innovation Futures</h3><p>Environmental health, NCDs, NTDs and resilient health systems.</p><span class="card-link">Explore →</span></div></a>
        <a href="research-food-economy.html" class="centre-card reveal"><img src="assets/images/image6.jpeg" alt="Food systems"><div class="centre-card-body"><h3>Food Systems, Bioeconomy &amp; Economic Transformation</h3><p>Agriculture, nutrition, enterprise and bioeconomy.</p><span class="card-link">Explore →</span></div></a>
        <a href="research-peace-borderlands.html" class="centre-card reveal"><img src="assets/images/image4.jpeg" alt="Peace and borderlands"><div class="centre-card-body"><h3>Peace, Security &amp; Borderland Futures</h3><p>Governance, mediation, mobility and human security.</p><span class="card-link">Explore →</span></div></a>
        <a href="research-indigenous-knowledge.html" class="centre-card reveal"><img src="assets/images/image12.jpeg" alt="Indigenous knowledge"><div class="centre-card-body"><h3>Indigenous Knowledge, Governance &amp; Cultural Futures</h3><p>Traditional governance, heritage, language and culture.</p><span class="card-link">Explore →</span></div></a>
      </div>
      <p style="text-align:center;margin-top:2.5rem;"><a href="research-platforms.html" class="btn btn-secondary">Shared platforms &amp; capabilities</a></p>
    </div></section>
"""
    + page_foot("research"),
)

centres = {
    "research-climate-landscapes.html": {
        "id": "research-climate",
        "title": "Centre for Climate, Environment and Landscape Futures",
        "meta_title": "Savanna Climate and Landscape Research | SAFI",
        "meta_desc": "Explore research priorities in savanna ecology, wildlife, wetlands, hills, watersheds and climate resilience across African landscapes.",
        "lead": "How can savanna landscapes sustain people and nature in a changing climate?",
        "image": "assets/images/image7.jpeg",
        "body": """
<p>This centre studies the relationships among climate, ecosystems, water, biodiversity, land use and livelihoods across inland and coastal savannas and their connected river basins and watersheds.</p>
<p>We combine field research, earth observation, local experience and indigenous ecological knowledge to understand change and develop useful options for planning, adaptation and landscape stewardship.</p>
<h2>Climate change and adaptation</h2>
<p>Heat, drought, floods, fire, climate variability and adaptation pathways are core priorities. Research will examine who is exposed, what makes communities vulnerable and which responses are practical in local conditions.</p>
<h2>Woodlands, grasslands and wildlife</h2>
<p>The agenda includes tree–grass relationships, habitat condition, biodiversity monitoring, protected and community-managed areas, ecological restoration and human–wildlife coexistence.</p>
<h2>River basins, wetlands and water security</h2>
<p>Research priorities include wetland ecology, hydrology, inland fisheries, water governance and transboundary systems. Ecosystem and carbon studies will use methods appropriate to each habitat.</p>
<h2>Highlands, hills and watersheds</h2>
<p>We examine hills, escarpments and headwaters as parts of connected landscapes, including erosion, soil conservation, watershed protection, climate refugia and the livelihoods of upland communities.</p>
<p>Work on agroforestry and productive landscapes connects this centre with Food Systems and Economic Transformation. Climate-exposure research also links directly with Population Health. Proposed observatory work would build reusable environmental evidence for these shared questions.</p>
""",
        "cta": ("Discuss landscape research", "contact.html"),
    },
    "research-population-health.html": {
        "id": "research-health",
        "title": "Centre for Population Health Innovation Futures",
        "meta_title": "Climate and Population Health Research | SAFI",
        "meta_desc": "Explore SAFI's agenda on climate and health, non-communicable diseases, neglected tropical diseases and resilient health systems.",
        "lead": "What does a changing environment mean for health and access to care?",
        "image": "assets/images/image3.jpeg",
        "body": """
<p>This centre investigates how climatic, environmental and social conditions shape health, and how services can respond fairly and effectively across savanna populations.</p>
<h2>Climate and environmental health</h2>
<p>Priorities include heat exposure, occupational health, air quality, climate-sensitive disease, mental health and health-system adaptation. Research will connect environmental conditions with people's everyday exposure and access to care.</p>
<h2>Non-communicable diseases (NCDs)</h2>
<p>The agenda includes hypertension, cardiovascular disease, diabetes, chronic kidney disease, cancer and multimorbidity. We examine prevention, social and behavioural risks and the conditions affecting long-term care.</p>
<h2>Infectious and neglected tropical diseases (NTDs)</h2>
<p>Research interests include vector and parasite ecology, environmental transmission, surveillance, community interventions and inequalities in prevention and treatment.</p>
<h2>Health systems and implementation science</h2>
<p>We focus on primary and community care, workforce resilience, health financing, digital health, service delivery and policy evaluation. Implementation research asks how evidence-based approaches work in practice, for whom and under what conditions.</p>
<h2>Population data and prediction</h2>
<p>Spatial epidemiology, surveillance, exposure modelling and risk assessment can help identify health needs. Their use requires suitable data, validation, privacy protections and careful interpretation.</p>
<h2>Connecting research with practice</h2>
<p>Proposed work on climate, hypertension and resilient primary care would link environmental and health evidence with decisions about prevention and services. Specific studies will be announced with their confirmed scope, partners, approvals and funding status.</p>
<p>We welcome collaboration with researchers, health institutions, practitioners and community organisations to develop questions that can improve the relevance of evidence to care and policy.</p>
""",
        "cta": ("Explore health research collaboration", "contact.html"),
    },
    "research-food-economy.html": {
        "id": "research-food",
        "title": "Centre for Food Systems, Bioeconomy and Economic Transformation",
        "meta_title": "Food Systems and Economic Transformation | SAFI",
        "meta_desc": "Discover SAFI's research priorities in dryland agriculture, nutrition, bioeconomy, enterprise and resilient local value chains.",
        "lead": "How can savanna regions produce nutritious food, strengthen livelihoods and retain more value locally?",
        "image": "assets/images/image6.jpeg",
        "body": """
<p>This centre connects agriculture, nutrition, enterprise and the responsible use of renewable biological resources. The bioeconomy includes products and services based on crops, livestock, natural materials and other biological resources.</p>
<h2>Resilient agriculture and livestock</h2>
<p>Priorities include dryland crops, soil health, agroforestry, pastoral livelihoods, animal health and integrated crop–livestock systems. Research will assess choices in relation to climate, water, labour and local knowledge.</p>
<h2>Food systems and nutrition</h2>
<p>We examine storage, processing, distribution, markets, food environments, nutrition security and loss reduction. The aim is to understand how food systems can improve both livelihoods and access to nutritious food.</p>
<h2>Technology and local innovation</h2>
<p>Appropriate mechanisation, digital extension, local fabrication, sensors and decision tools will be assessed for usefulness, affordability and adoption in real settings.</p>
<h2>Circular and biological production</h2>
<p>The agenda includes renewable natural products, biomaterials, waste reduction and recovery of useful resources. Environmental benefits and livelihood claims need to be assessed rather than assumed.</p>
<h2>Enterprise and economic opportunity</h2>
<p>We explore value chains, local processing, finance, green enterprise and opportunities for women and young people. Attention to who retains value is central to the approach.</p>
<h2>Testing ideas together</h2>
<p>Proposed living labs would bring producers, researchers, communities and businesses together to develop and test innovations. Potential outputs include value-chain assessments, enterprise diagnostics, trials, investment cases and policy options, with attention to environmental and social outcomes.</p>
<p>Landscape research contributes evidence on ecological conditions; health research contributes nutrition and wellbeing perspectives; and cultural and governance research helps explain adoption, rights and local institutions.</p>
""",
        "cta": ("Discuss food systems and enterprise", "contact.html"),
    },
    "research-peace-borderlands.html": {
        "id": "research-peace",
        "title": "Centre for Peace, Security and Borderland Futures",
        "meta_title": "Peace and Borderlands Research | SAFI",
        "meta_desc": "Explore research on governance, mediation, mobility, livelihoods and human security in African savanna and borderland societies.",
        "lead": "How can communities strengthen peace and livelihoods in places shaped by mobility, competing claims and insecurity?",
        "image": "assets/images/image4.jpeg",
        "body": """
<p>This centre examines governance, identity, resources and cross-border economies to support locally relevant evidence for human security.</p>
<h2>Borderland governance and economies</h2>
<p>Research covers cross-border trade, mobility, migration, informal institutions, state–community relations and access to services. Borderlands are considered as places of economic and social connection as well as risk.</p>
<h2>Conflict prevention and violent extremism</h2>
<p>We study interacting drivers of insecurity, recruitment vulnerabilities, protective factors, community prevention and regional cooperation. Context-sensitive analysis is essential to avoid stigmatising communities.</p>
<h2>Land, identity and communal disputes</h2>
<p>The agenda includes tenure, chieftaincy disputes, resource competition, historical grievances and identity politics. Environmental change is examined alongside political and economic conditions rather than treated as a single cause of conflict.</p>
<h2>Mediation and conflict transformation</h2>
<p>Research priorities include traditional and formal mediation, dialogue, reconciliation, restorative approaches and local institutions for peace.</p>
<h2>Human security and resilience</h2>
<p>We examine livelihood insecurity, displacement, food access and the experiences of women and young people. The aim is to understand what enables people to live safely and participate in economic and community life.</p>
<h2>Evidence that protects trust</h2>
<p>Research in conflict-affected places must consider confidentiality, consent and the risks of identifying people or sensitive locations. Proposed assessments and early-warning work will need appropriate governance and locally legitimate partnerships.</p>
<p>The developing Bawku regeneration programme offers a potential setting for connecting evidence on livelihoods, assets, community priorities and conflict-sensitive investment.</p>
""",
        "cta": ("Explore the Bawku programme", "programmes-bairp.html"),
    },
    "research-indigenous-knowledge.html": {
        "id": "research-knowledge",
        "title": "Centre for Indigenous Knowledge, Governance and Cultural Futures",
        "meta_title": "Indigenous Knowledge Governance and Culture | SAFI",
        "meta_desc": "Explore SAFI's approach to indigenous knowledge, traditional governance, language, heritage and community-led learning.",
        "lead": "How can living knowledge, institutions and historical experience help shape the future?",
        "image": "assets/images/image12.jpeg",
        "body": """
<p>This centre studies indigenous knowledge, governance, language, heritage and social change as sources of insight and capability.</p>
<h2>Traditional and plural governance</h2>
<p>The agenda includes traditional authority, customary law, chieftaincy and other forms of community governance, including institutions without centralised chiefs. Research examines legitimacy, accountability, collective action and relationships with the state.</p>
<h2>Indigenous knowledge systems</h2>
<p>Ecological, farming, weather, healing and peace knowledge are considered alongside community innovation. Knowledge holders help frame questions and determine appropriate use; documenting a practice does not by itself establish its safety or effectiveness.</p>
<h2>History, memory and development</h2>
<p>Priorities include oral history, colonial legacies, migration, border-making and the ways historical experience shapes present institutions and opportunities.</p>
<h2>Language, identity and heritage</h2>
<p>We explore indigenous languages, oral literature, festivals, material culture and cultural landscapes, including how knowledge and meaning pass between generations.</p>
<h2>Culture and social transformation</h2>
<p>Research considers youth, gender, diaspora identities, social cohesion and cultural enterprise. Culture is approached as living and changing rather than fixed in the past.</p>
<h2>Knowledge partnerships built on consent</h2>
<p>A proposed Cultural Memory Commons would support community-governed documentation and learning. Knowledge holders would help determine what is recorded, how it is interpreted and who can access it. Sensitive knowledge should remain under appropriate community control, with clear attribution and agreed benefits.</p>
<p>The proposed collaboration with the Ghana National Commission for UNESCO creates an opportunity to connect knowledge, learning, water and climate resilience through jointly developed work.</p>
""",
        "cta": ("Explore the proposed collaboration", "programmes-unesco-collaboration.html"),
    },
}

for fname, data in centres.items():
    write(
        fname,
        page_head(data["meta_title"], data["meta_desc"], data["id"])
        + page_hero(
            data["title"],
            data["lead"],
            [' <span>&rsaquo;</span> <a href="research.html">Research</a>', f' <span>&rsaquo;</span> <span>{data["title"].split(" for ")[0].split("Centre for ")[-1][:30]}…</span>'],
            data["image"],
        )
        + content_page(
            data["body"],
            [
                ("Research overview", "research.html", False),
                ("Climate & Landscapes", "research-climate-landscapes.html", fname.endswith("climate-landscapes.html")),
                ("Population Health", "research-population-health.html", fname.endswith("population-health.html")),
                ("Food & Economy", "research-food-economy.html", fname.endswith("food-economy.html")),
                ("Peace & Borderlands", "research-peace-borderlands.html", fname.endswith("peace-borderlands.html")),
                ("Indigenous Knowledge", "research-indigenous-knowledge.html", fname.endswith("indigenous-knowledge.html")),
                ("Shared Platforms", "research-platforms.html", False),
            ],
        )
        + cta("", data["cta"][0], data["cta"][1].replace("contact.html", "Contact us") if False else data["cta"][0])
        + page_foot(data["id"]),
    )
    # Fix CTA - regenerate with proper link
    cta_label, cta_link = data["cta"]
    content = page_head(data["meta_title"], data["meta_desc"], data["id"]) + page_hero(
        data["title"], data["lead"],
        [' <span>&rsaquo;</span> <a href="research.html">Research</a>', ' <span>&rsaquo;</span> <span>Centre</span>'],
        data["image"],
    ) + content_page(data["body"], [
        ("Research overview", "research.html", False),
        ("Climate & Landscapes", "research-climate-landscapes.html", "climate-landscapes" in fname),
        ("Population Health", "research-population-health.html", "population-health" in fname),
        ("Food & Economy", "research-food-economy.html", "food-economy" in fname),
        ("Peace & Borderlands", "research-peace-borderlands.html", "peace-borderlands" in fname),
        ("Indigenous Knowledge", "research-indigenous-knowledge.html", "indigenous-knowledge" in fname),
        ("Shared Platforms", "research-platforms.html", False),
    ]) + cta("", cta_link, cta_label) + page_foot(data["id"])
    write(fname, content)

# PLATFORMS
write(
    "research-platforms.html",
    page_head(
        "Data Policy Learning and Finance Platforms | SAFI",
        "Learn about SAFI's developing shared capabilities in data, policy, natural capital, climate finance, training and global partnerships.",
        "research-platforms",
    )
    + page_hero(
        "Capabilities that connect our centres",
        "SAFI's strategy includes four shared platforms, developed alongside the programme portfolio.",
        [' <span>&rsaquo;</span> <a href="research.html">Research</a>', ' <span>&rsaquo;</span> <span>Shared Platforms</span>'],
        "assets/images/image8.jpeg",
    )
    + content_page(
        """
<p class="lead">They will develop alongside the programme portfolio, helping specialist research inform decisions, strengthen skills and build equitable partnerships.</p>
<h2>Futures Intelligence, Data and Policy Innovation</h2>
<p>This platform connects GIS and remote sensing, climate and population analysis, responsible use of AI, systems modelling, foresight and scenario planning. Research synthesis, monitoring, evaluation and learning help teams assess change and explain what findings mean for decisions. Policy labs and research communications will connect this evidence with its intended users.</p>
<h2>Natural Capital, Climate Finance and Impact</h2>
<p>This facility will connect ecosystem evidence with planning and responsible investment. Priorities include ecosystem accounting, measurement of soil, biomass and wetland carbon, climate-finance programme design and assessment of who benefits and who bears risk. Community rights, transparent methods and disclosed financial interests are central to the approach.</p>
<h2>Savannah Futures Academy and Fellowships</h2>
<p>The Academy is being developed to strengthen researchers, practitioners, policymakers and community knowledge experts through short courses, methods workshops, executive learning and fellowships. Learning activities will be announced with clear eligibility, costs, available support and application arrangements. <a href="academy.html">Learn more about the Academy →</a></p>
<h2>Global Savanna Partnerships Forum</h2>
<p>The proposed Forum will support Africa-led comparative research and reciprocal learning with partners working in savannas, grasslands and drylands internationally. Shared questions, fair responsibilities and lasting capability will guide its development.</p>
<h2>How shared work will be delivered</h2>
<ul>
<li><strong>Observatories</strong> track change over time.</li>
<li><strong>Living labs</strong> allow researchers and users to develop and test ideas together.</li>
<li><strong>Policy labs</strong> bring evidence and decision-makers together to explore workable options.</li>
<li><strong>Knowledge commons</strong> organise information with appropriate access and ownership arrangements.</li>
</ul>
<p>These approaches will be established in stages through resourced programmes. We welcome partners who can contribute complementary skills, methods, data stewardship or training to a defined programme of work.</p>
""",
        [
            ("Research overview", "research.html", False),
            ("Shared Platforms", "research-platforms.html", True),
        ],
    )
    + cta("Discuss a capability partnership.", "partnerships.html", "Explore partnerships")
    + page_foot("research-platforms"),
)

# --- PROGRAMMES ---
write(
    "programmes.html",
    page_head(
        "Programme Priorities in Development | SAFI",
        "Explore SAFI's proposed UNESCO Commission collaboration and Bawku regeneration programme, including current development status.",
        "programmes",
    )
    + page_hero(
        "Programme development focused on place and purpose",
        "SAFI is concentrating its immediate programme-development effort on two priorities that connect research with institutional and community needs.",
        [' <span>&rsaquo;</span> <span>Programmes</span>'],
        "assets/images/image9.png",
        "Both programmes in development",
    )
    + content_page(
        """
<p class="lead">Both are in development. Delivery depends on agreed scope, partnerships, resources and the approvals relevant to the proposed activities.</p>
<h2>Proposed National Partnership for Impact: Ghana National Commission for UNESCO Programme</h2>
<p>A proposed collaboration bringing research, indigenous knowledge, learning and policy engagement together around resilient landscapes and communities. The proposed flagship is the Savanna Water, Indigenous Knowledge and Climate Resilience Initiative.</p>
<div class="info-box"><p><strong>Status:</strong> Proposed collaboration in development. Institutional agreement and funding are not yet confirmed in this public summary.</p></div>
<p><a href="programmes-unesco-collaboration.html" class="btn btn-secondary">Explore the proposed partnership →</a></p>
<h2>Local Governance support for Bawku Municipal: Assets Investment and Regeneration Programme</h2>
<p>The developing BAIRP programme would build an evidence base on assets, livelihoods, infrastructure, environmental resources and community priorities to inform regeneration and responsible investment. Its proposed scope includes Bawku Municipality and selected conflict-affected areas of Pusiga and Binduri.</p>
<div class="info-box"><p><strong>Status:</strong> Programme concept in development. Detailed scope, delivery arrangements and funding remain to be agreed.</p></div>
<p><a href="programmes-bairp.html" class="btn btn-secondary">Explore BAIRP →</a></p>
<h2>Research themes supporting future programmes</h2>
<p>Our wider research agenda includes savanna observatories; climate and health; wetlands and natural capital; borderlands and human security; indigenous knowledge; and resilient food and enterprise systems. These themes guide collaboration across the five centres and will develop into projects as specific opportunities become ready.</p>
<h2>How to engage</h2>
<p>Researchers, public institutions, community organisations, businesses and funders can contribute questions, local experience, technical capability or resources. We welcome conversations that help define realistic next steps and fair responsibilities.</p>
""",
        [
            ("Programmes overview", "programmes.html", True),
            ("UNESCO collaboration", "programmes-unesco-collaboration.html", False),
            ("BAIRP", "programmes-bairp.html", False),
            ("Partnerships", "partnerships.html", False),
        ],
    )
    + cta("Discuss a programme.", "contact.html", "Contact us")
    + page_foot("programmes"),
)

write(
    "programmes-unesco-collaboration.html",
    page_head(
        "Proposed UNESCO Commission Collaboration | SAFI",
        "Explore SAFI's proposed collaboration with the Ghana National Commission for UNESCO on water, indigenous knowledge and climate resilience.",
        "programmes-unesco",
    )
    + page_hero(
        "Connecting water, indigenous knowledge and climate resilience",
        "SAFI is developing proposals for collaboration with the Ghana National Commission for UNESCO.",
        [' <span>&rsaquo;</span> <a href="programmes.html">Programmes</a>', ' <span>&rsaquo;</span> <span>UNESCO Collaboration</span>'],
        "assets/images/image9.png",
        "Proposed collaboration in development",
    )
    + content_page(
        """
<p class="lead">The proposed partnership would connect research, indigenous knowledge, education and policy engagement to support resilient landscapes and communities.</p>
<div class="info-box"><p><strong>Status:</strong> Proposed collaboration in development, subject to institutional agreement, programme design and funding.</p></div>
<h2>Why this collaboration matters</h2>
<p>Water, livelihoods and knowledge are closely connected in savanna regions. Decisions about wetlands, catchments and adaptation can benefit from scientific evidence and the experience of people who live and work in these landscapes. The proposed collaboration would create opportunities to bring these perspectives into research, learning and policy dialogue.</p>
<h2>Proposed flagship initiative</h2>
<p>The <strong>Savanna Water, Indigenous Knowledge and Climate Resilience Initiative</strong> would connect water and wetland research with community knowledge, intergenerational learning and practical adaptation. Its detailed geography, activities and delivery arrangements will be developed through consultation and agreement.</p>
<h2>Proposed areas of joint work</h2>
<ul>
<li><strong>Water and landscape evidence</strong> — Develop shared questions about wetlands, catchments, livelihoods and climate risks.</li>
<li><strong>Indigenous knowledge and learning</strong> — Support ethical knowledge exchange, documentation where appropriate, and learning between generations.</li>
<li><strong>Policy and practical application</strong> — Translate evidence into accessible learning materials, dialogue and options for local and institutional decisions.</li>
<li><strong>Programme and funding development</strong> — Build agreed concepts, delivery relationships and credible funding proposals.</li>
</ul>
<h2>SAFI's contribution</h2>
<p>SAFI proposes to contribute interdisciplinary programme design, research coordination, community-engaged methods and translation of findings into policy and learning outputs. Contributions from the Commission and other prospective participants will be described once jointly agreed.</p>
<h2>Next steps</h2>
<p>The immediate task is to agree priorities, clarify responsibilities and develop a feasible programme and funding approach. Programme updates will distinguish proposals from agreed activities and report progress as it is confirmed.</p>
""",
        [
            ("Programmes overview", "programmes.html", False),
            ("UNESCO collaboration", "programmes-unesco-collaboration.html", True),
            ("BAIRP", "programmes-bairp.html", False),
        ],
    )
    + cta("Discuss support or collaboration.", "contact.html", "Contact us")
    + page_foot("programmes-unesco"),
)

write(
    "programmes-bairp.html",
    page_head(
        "Bawku Assets and Regeneration Programme | SAFI",
        "Explore the developing BAIRP concept for asset assessment, livelihoods and responsible investment in Bawku and selected neighbouring areas.",
        "programmes-bairp",
    )
    + page_hero(
        "Bawku Municipal Assets Investment and Regeneration Programme",
        "BAIRP is a developing programme to support evidence-informed regeneration in Bawku Municipality and selected conflict-affected neighbouring areas.",
        [' <span>&rsaquo;</span> <a href="programmes.html">Programmes</a>', ' <span>&rsaquo;</span> <span>BAIRP</span>'],
        "assets/images/image4.jpeg",
        "Programme concept in development",
    )
    + content_page(
        """
<div class="info-box"><p><strong>Status:</strong> Programme concept in development. Scope, participation, commissioning, delivery arrangements and funding are subject to agreement.</p></div>
<h2>Purpose</h2>
<p>Regeneration requires a clear picture of what exists, what has been affected and where practical opportunities lie. The proposed programme would examine productive, environmental, social and cultural assets alongside infrastructure and service needs, with attention to the effects of prolonged insecurity.</p>
<h2>Proposed areas of inquiry</h2>
<ul>
<li><strong>Livelihoods and enterprise</strong> — Agriculture, livestock, markets, trade, local skills and value chains.</li>
<li><strong>Landscapes and resources</strong> — Water, land, economic trees and other environmental assets.</li>
<li><strong>Infrastructure and services</strong> — Access, connectivity and the facilities that support everyday life and investment.</li>
<li><strong>Culture and institutions</strong> — Community knowledge, cultural resources and the organisations shaping development.</li>
<li><strong>Investment priorities</strong> — Feasible opportunities and the conditions needed for fair and durable benefits.</li>
</ul>
<h2>Research and engagement approach</h2>
<p>The developing approach would combine asset assessment, spatial information and dialogue with communities, institutions and potential delivery partners. Findings would help identify priorities for further feasibility work, investment planning and funding proposals. Any public maps or datasets would require review for accuracy and conflict sensitivity.</p>
<h2>Connecting SAFI's centres</h2>
<p>The programme would bring together landscape, food and economic, peace, health and cultural perspectives. This integrated approach is intended to avoid treating regeneration as an infrastructure exercise alone.</p>
<h2>How to contribute</h2>
<p>We welcome relevant local knowledge, technical expertise and discussions with prospective commissioning, delivery and funding partners. Contributions should help build an agreed evidence base and practical next steps; they do not imply endorsement or a commitment to invest.</p>
""",
        [
            ("Programmes overview", "programmes.html", False),
            ("UNESCO collaboration", "programmes-unesco-collaboration.html", False),
            ("BAIRP", "programmes-bairp.html", True),
        ],
    )
    + cta("Discuss BAIRP.", "contact.html", "Contact us")
    + page_foot("programmes-bairp"),
)

write(
    "partnerships.html",
    page_head(
        "Research Partnerships and Support | SAFI",
        "Discuss research, policy, community, enterprise and funding partnerships with The Savannah Futures Institute, Ghana.",
        "partnerships",
    )
    + page_hero(
        "Working across sectors and borders",
        "Africa's savanna challenges require collaboration across disciplines, institutions and communities.",
        [' <span>&rsaquo;</span> <span>Partnerships</span>'],
        "assets/images/image8.jpeg",
    )
    + content_page(
        """
<p class="lead">SAFI welcomes partnerships that address a clear question, combine complementary strengths and leave lasting capability with the people and institutions involved.</p>
<h2>Academic and research partnerships</h2>
<p>Explore joint studies, comparative methods, co-developed proposals, data partnerships, mentoring and researcher exchanges. We seek clarity on scientific roles, resources, authorship and the use of findings from the outset.</p>
<h2>Government and policy partnerships</h2>
<p>Discuss evidence needs, planning questions, research synthesis and policy dialogue. Research should support informed choices while retaining independence in methods, interpretation and publication.</p>
<h2>Community and traditional institution partnerships</h2>
<p>Help frame locally relevant questions, guide engagement and determine how knowledge is used. Participation should recognise knowledge holders' contributions and provide appropriate ways to share findings and raise concerns.</p>
<h2>Civil society and professional partnerships</h2>
<p>Bring implementation experience, rights-based perspectives, specialist skills and connections with the people affected by decisions.</p>
<h2>Enterprise and finance partnerships</h2>
<p>Explore responsible innovation, value-chain research and investment analysis. Financial interests and potential conflicts need to be clear, particularly where research and commercial development intersect.</p>
<h2>Support SAFI's development</h2>
<p>Funders and philanthropic partners can help develop coherent programmes, strengthen research capability and make evidence accessible to communities and decision-makers. We welcome discussions about programme support, fellowships, shared technical resources and institutional development.</p>
<h2>Begin with a conversation</h2>
<p>Tell us about the question you want to address, the place or population involved and the contribution you can make. We will consider mission fit, scientific quality, practical value, resources and fairness before developing an agreed workplan.</p>
""",
    )
    + cta("Propose a partnership.", "contact.html", "Contact us")
    + page_foot("partnerships"),
)

write(
    "academy.html",
    page_head(
        "Training and Opportunities | SAFI",
        "Learn about the developing Savannah Futures Academy and find confirmed courses, fellowships and professional opportunities when available.",
        "academy",
    )
    + page_hero(
        "Learn and work with SAFI",
        "The Savannah Futures Academy is being developed to connect research with practice.",
        [' <span>&rsaquo;</span> <span>Academy</span>'],
        "assets/images/image12.jpeg",
    )
    + """
    <section class="page-content"><div class="container"><div class="content-body">
      <p class="lead">Planned learning areas include interdisciplinary methods, climate and landscape analysis, indigenous knowledge and governance, research leadership, policy engagement and responsible finance.</p>
      <h2>Planned offerings</h2>
      <ul>
        <li>Short courses and methods workshops for researchers and practitioners</li>
        <li>Executive learning for policymakers and institutional leaders</li>
        <li>Fellowships for researchers, practitioners and community knowledge experts</li>
        <li>Internships and visiting roles (announced when confirmed)</li>
      </ul>
      <p>Courses, fellowships, internships, visiting roles and other opportunities will be announced when confirmed. Each notice will explain eligibility, responsibilities, location, duration, costs or remuneration, available support and how to apply.</p>
      <div class="empty-state reveal" style="margin-top:2rem;">
        <h3>No confirmed opportunities yet</h3>
        <p>Learning activities and application processes will be published here once arrangements are confirmed. We welcome conversations about institutional training needs and learning partnerships.</p>
      </div>
    </div></div></section>
"""
    + cta("Discuss learning or professional collaboration.", "contact.html", "Contact us")
    + page_foot("academy"),
)

write(
    "publications.html",
    page_head(
        "Publications and Knowledge Products | SAFI",
        "Browse available SAFI research, policy briefs, reports, discussion papers and other knowledge products for research and practice.",
        "publications",
    )
    + page_hero(
        "Knowledge for research, policy and practice",
        "SAFI's publications bring research and analysis into forms that different audiences can use.",
        [' <span>&rsaquo;</span> <span>Publications</span>'],
    )
    + """
    <section class="page-content"><div class="container"><div class="content-body">
      <p>Browse available articles, policy briefs, working papers, technical reports, discussion papers, maps and research summaries. Each entry explains the question addressed, its main contribution and how to access the work.</p>
      <p>Where appropriate, datasets and methods will be shared with clear documentation and access conditions. Community knowledge will be shared in accordance with consent and agreed knowledge rights.</p>
      <div class="empty-state reveal" style="margin-top:2rem;">
        <h3>Publications coming soon</h3>
        <p>Institute series may include SAFI Policy Briefs, Working Papers, Savannah Futures Reports, Data Notes and Community Knowledge publications — introduced when there is an editor and a real first output.</p>
      </div>
    </div></div></section>
"""
    + page_foot("publications"),
)

write(
    "insights.html",
    page_head(
        "News, Research and Policy Insights | SAFI",
        "Read SAFI's published news, research explainers and policy perspectives on landscapes, health, livelihoods, peace and culture.",
        "insights",
    )
    + page_hero(
        "Research and policy insights",
        "Our Insights section explains emerging questions, research findings and lessons from programme development.",
        [' <span>&rsaquo;</span> <span>Insights</span>'],
    )
    + """
    <section class="page-content"><div class="container"><div class="content-body">
      <p>We distinguish what evidence shows from interpretation, proposals and questions that remain open.</p>
      <h2>Browse by topic</h2>
      <div class="topic-list">
        <div class="topic-tag">Landscapes and Climate</div>
        <div class="topic-tag">Population Health</div>
        <div class="topic-tag">Food and Enterprise</div>
        <div class="topic-tag">Peace and Borderlands</div>
        <div class="topic-tag">Indigenous Knowledge and Culture</div>
      </div>
      <h2>Browse by format</h2>
      <div class="topic-list">
        <div class="topic-tag">Institute News</div>
        <div class="topic-tag">Research Explainers</div>
        <div class="topic-tag">Policy Perspectives</div>
        <div class="topic-tag">Field Stories</div>
        <div class="topic-tag">Interviews</div>
        <div class="topic-tag">Events</div>
      </div>
      <div class="empty-state reveal" style="margin-top:2rem;">
        <h3>Insights coming soon</h3>
        <p>News, research explainers and policy perspectives will be published when approved content is available. Follow SAFI's verified channels for updates.</p>
      </div>
      <h2 style="margin-top:2.5rem;">For journalists and communicators</h2>
      <p>Contact SAFI for media enquiries, background on our research priorities or requests to speak with an appropriate expert. Please include your topic, publication or outlet, deadline and preferred contact details. We will direct the request to the relevant person.</p>
      <div class="info-box"><p><strong>Institutional description for media use:</strong> The Savannah Futures Institute (SAFI) is a Ghana-based, African-led research, innovation and policy institute focused on Africa's inland and coastal savannas. Its five research centres connect landscapes, population health, food systems, peace and borderlands, and indigenous knowledge and culture. SAFI is developing programmes and equitable partnerships to translate evidence into policy, learning and practical action.</p></div>
      <p><a href="contact.html" class="btn btn-secondary">Make a media enquiry →</a></p>
    </div></div></section>
"""
    + page_foot("insights"),
)

write(
    "contact.html",
    page_head(
        "Contact SAFI | Research Partnerships and Media",
        "Contact The Savannah Futures Institute in Accra about research, policy evidence, partnerships, funding, learning or media enquiries.",
        "contact",
    )
    + page_hero(
        "Contact The Savannah Futures Institute",
        "Have a research question, a partnership idea or an evidence need? Tell us about your organisation or community, the issue you want to address and how you would like to work with SAFI.",
        [' <span>&rsaquo;</span> <span>Contact</span>'],
    )
    + """
    <section class="page-content"><div class="container contact-grid">
      <div class="contact-info content-body">
        <div class="contact-detail"><strong>Location</strong><span>Accra, Ghana</span></div>
        <div class="contact-detail"><strong>General enquiries</strong><a href="mailto:info@savannahfutures.org">info@savannahfutures.org</a></div>
        <div class="contact-detail"><strong>Telephone</strong><span>[Approved public telephone — to be verified before launch]</span></div>
        <div class="contact-detail"><strong>Office address</strong><span>[Verified address — to be confirmed before launch]</span></div>
        <div class="info-box" style="margin-top:1.5rem;"><p>Please avoid including sensitive health information or confidential details about other people in this general enquiry form. A privacy notice will be published when contact arrangements are finalised.</p></div>
      </div>
      <form class="contact-form" id="contactForm" action="#" method="post">
        <div class="form-success info-box" hidden role="status"><p><strong>Thank you for contacting SAFI.</strong> Your enquiry has been received.</p></div>
        <div class="form-row"><label for="name">Name</label><input type="text" id="name" name="name" required autocomplete="name"></div>
        <div class="form-row"><label for="email">Email</label><input type="email" id="email" name="email" required autocomplete="email"></div>
        <div class="form-row"><label for="organisation">Organisation or community, if relevant</label><input type="text" id="organisation" name="organisation"></div>
        <div class="form-row"><label for="topic">Enquiry topic</label>
          <select id="topic" name="topic" required>
            <option value="">Select a topic</option>
            <option value="research">Research</option>
            <option value="policy">Policy and evidence</option>
            <option value="community">Community partnership</option>
            <option value="funding">Funding</option>
            <option value="learning">Learning and opportunities</option>
            <option value="media">Media</option>
            <option value="governance">Governance or concern</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-row"><label for="message">Message</label><textarea id="message" name="message" rows="5" required placeholder="Tell us about your enquiry..."></textarea></div>
        <button type="submit" class="btn btn-primary btn-full">Send enquiry</button>
        <p class="form-note">Form demonstration — connect to a tested backend before public launch.</p>
      </form>
    </div></section>
"""
    + page_foot("contact"),
)

print("All pages generated")
