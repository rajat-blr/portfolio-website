"""Build the website resume using the supplied Cambria reference PDF.

Requires reportlab, pypdf and pymupdf. Pass a reference PDF as the first
argument, or install full Cambria fonts and set RESUME_FONT_DIR.
The reference contains font subsets, so absent characters use a serif fallback.
"""
from pathlib import Path
from html import escape
import os
import sys
import tempfile

import pymupdf
from pypdf import PdfReader
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'Rajat_Varma_Resume.pdf'
REFERENCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / 'Downloads' / 'Abhay_Resume_FE.pdf'
FONT_DIR = os.environ.get('RESUME_FONT_DIR')
FONT_TEMP = tempfile.TemporaryDirectory(prefix='resume-fonts-')
faces = {}
if FONT_DIR:
    files = {'Cambria': 'cambria.ttf', 'Cambria-Bold': 'cambriab.ttf', 'Cambria-Italic': 'cambriai.ttf'}
    for name, filename in files.items():
        faces[name] = TTFont(name, str(Path(FONT_DIR) / filename))
else:
    ref = pymupdf.open(REFERENCE)
    for page in ref:
        for xref, _, _, base, *_ in page.get_fonts(full=True):
            name = base.split('+')[-1]
            if name in {'Cambria', 'Cambria-Bold', 'Cambria-Italic'} and name not in faces:
                _, ext, _, data = ref.extract_font(xref)
                file = Path(FONT_TEMP.name) / f'{name}.{ext}'
                file.write_bytes(data)
                faces[name] = TTFont(name, str(file))
    ref.close()
for name, font in faces.items():
    pdfmetrics.registerFont(font)
assert len(faces) == 3, 'Cambria regular, bold and italic fonts are required'


def text(value, face='Cambria'):
    """Escape text and supply missing subset glyphs from a serif font."""
    fallback = {'Cambria': 'Times-Roman', 'Cambria-Bold': 'Times-Bold', 'Cambria-Italic': 'Times-Italic'}[face]
    pieces = []
    for ch in value:
        escaped = escape(ch)
        if ord(ch) not in faces[face].face.charToGlyph:
            escaped = f'<font name="{fallback}">{escaped}</font>'
        pieces.append(escaped)
    return f'<font name="{face}">{"".join(pieces)}</font>'


def bold(value):
    return text(value, 'Cambria-Bold')


def italic(value):
    return text(value, 'Cambria-Italic')


def link(label, url):
    return f'<link href="{escape(url, quote=True)}"><u>{bold(label)}</u></link>'


W, H = A4
L, R = 30, W - 30
width = R - L
c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle('Rajat Varma | Senior Software Engineer')
c.setAuthor('Rajat Varma')
c.setSubject('Backend systems, AI infrastructure and selected engineering projects')
y = H - 24
styles = {
    'body': ParagraphStyle('body', fontName='Cambria', fontSize=9.7, leading=14, textColor=colors.black),
    'contact': ParagraphStyle('contact', fontName='Cambria', fontSize=9.2, leading=12.2, textColor=colors.black),
    'name': ParagraphStyle('name', fontName='Cambria-Bold', fontSize=20, leading=24),
    'role': ParagraphStyle('role', fontName='Cambria', fontSize=15, leading=19),
    'section': ParagraphStyle('section', fontName='Cambria-Bold', fontSize=12, leading=15),
}


def para(markup, style='body', indent=0, gap=2):
    global y
    p = Paragraph(markup, styles[style])
    _, h = p.wrap(width - indent, H)
    p.drawOn(c, L + indent, y - h)
    y -= h + gap


def section(title):
    global y
    y -= 13
    c.setLineWidth(1.25)
    c.line(L, y - 7, L + 112, y - 7)
    p = Paragraph(bold(title.upper()), styles['section'])
    _, h = p.wrap(width - 119, 30)
    p.drawOn(c, L + 119, y - h)
    y -= h + 5


def bullet(value):
    c.setFillColor(colors.black)
    c.circle(L + 3, y - 5.6, 1.15, fill=1, stroke=0)
    para(text(value), indent=11, gap=2)


# The reference places identity on the left and labelled contact links on the right.
p = Paragraph(bold('Rajat Varma'), styles['name'])
p.wrap(285, 40)
p.drawOn(c, L + 5, y - 24)
p = Paragraph(text('Senior Software Engineer'), styles['role'])
p.wrap(285, 30)
p.drawOn(c, L + 5, y - 45)
contact = [
    ('Email', 'vrajatlink@gmail.com', 'mailto:vrajatlink@gmail.com'),
    ('GitHub', 'github.com/rajat-blr', 'https://github.com/rajat-blr'),
    ('LinkedIn', 'linkedin.com/in/rajatvarma2709', 'https://www.linkedin.com/in/rajatvarma2709'),
    ('Portfolio', 'rajat-portfolio-iota.vercel.app', 'https://rajat-portfolio-iota.vercel.app/'),
]
contact_x = L + 297
contact_y = y
for label, display, url in contact:
    p = Paragraph(bold(label + ': ') + f'<link href="{url}"><u>{text(display)}</u></link>', styles['contact'])
    _, h = p.wrap(R - contact_x, 30)
    p.drawOn(c, contact_x, contact_y - h)
    contact_y -= h
assert y - contact_y < 60

y -= 58
section('Work experience')
para(bold('Senior Software Engineer | Microsoft ') + italic('(Jan 2026 - Present)'), gap=0)
para(bold('Software Engineer | Microsoft ') + italic('(Mar 2025 - Jan 2026)'), gap=4)
bullet('Lead the design of a microservice for agent orchestration at scale, with observability built into its operating model.')
bullet('Developed and optimized RAG and context pipelines to improve agent performance and efficiency.')
bullet('Built a production search agent; collaborate across teams to improve performance, reliability and user experience.')
y -= 9
para(bold('Software Development Engineer II | Flipkart ') + italic('(Jun 2023 - Mar 2025)'), gap=0)
para(bold('Software Development Engineer | Flipkart ') + italic('(Jun 2022 - Jun 2023)'), gap=4)
bullet('Improved service reliability for Big Billion Days peak traffic, helping sustain events serving millions of requests.')
bullet('Maintained and optimized a payment backend under strict latency and correctness constraints.')
bullet('Built a RAG pipeline for user data and metrics, improving data observability and investigation of production behavior.')

section('Projects')
projects = [
    ('IncidentLab', 'AI reliability', 'https://github.com/rajat-blr/incidentlab', [
        'Built an incident investigation and repair-verification system with cited evidence, human approval and fail-closed policy checks.',
        'Implemented an independent verifier in a network-disabled Docker sandbox using React, FastAPI, PostgreSQL, Temporal and OpenTelemetry.',
    ], 'https://incidentlab-flax.vercel.app/runs'),
    ('Agent Workbench', 'Coding agent evaluation', 'https://github.com/rajat-blr/agent-workbench', [
        'Built a local-first evaluation lab with frozen task suites, immutable configuration snapshots, isolated Git worktrees and independent graders.',
        'Retained traces and diffs to make regressions inspectable in an Electron, React, FastAPI and SQLite desktop app with Codex CLI.',
    ], 'https://agent-workbench-tau.vercel.app/'),
    ('Juniper', 'Voice AI', 'https://github.com/rajat-blr/juniper-voiceAI', [
        'Built a voice receptionist for booking and rescheduling with explicit confirmation, duplicate-safe retries and durable session recovery.',
        'Enforced database constraints against overlapping appointments with TypeScript, Python, LiveKit, Fastify and PostgreSQL.',
    ], 'https://juniper-voice-ai.vercel.app'),
    ('LLM Gateway', 'LLM infrastructure', 'https://github.com/rajat-blr/llm-gateway', [
        'Built an OpenAI-compatible Go gateway with bounded streaming, primary/backup routing and shared Redis token admission.',
        'Implemented per-attempt usage accounting in SQLite, Prometheus metrics and Grafana dashboards for provider and request visibility.',
    ], None),
]
for i, (name, description, source, bullets, demo) in enumerate(projects):
    if i:
        y -= 9
    heading = bold(name) + text(' - ' + description + ' | ') + link('Source Code', source)
    if demo:
        heading += text(' | ') + link('Live demo', demo)
    else:
        heading += text(' | ') + link('Case study', 'https://rajat-portfolio-iota.vercel.app/work/llm-gateway/')
    para(heading, gap=3)
    for b in bullets:
        bullet(b)

section('Skills')
for label, value in [
    ('Engineering', 'Python, Go, TypeScript, React, FastAPI'),
    ('Databases & Messaging', 'PostgreSQL, SQLite, Redis, Kafka'),
    ('AI Systems', 'RAG, agent orchestration, evaluations, LLMOps, sandboxing, guardrails'),
    ('Infrastructure', 'Kubernetes, containers, orchestration, CI/CD, Prometheus, Grafana'),
]:
    para(bold(label + ': ') + text(value), gap=2)

section('Education')
# Keep the reference's table format, using only verified education details.
rows = [
    [Paragraph(bold('Year'), styles['body']), Paragraph(bold('Degree / Examination'), styles['body']), Paragraph(bold('Institution / Board'), styles['body']), Paragraph(bold('Grade'), styles['body'])],
    [Paragraph(text('2021'), styles['body']), Paragraph(text('BTech, Computer Science & Engineering'), styles['body']), Paragraph(text('Ramaiah Institute of Technology, Bengaluru'), styles['body']), Paragraph(text('9.2'), styles['body'])],
]
table = Table(rows, colWidths=[width * .10, width * .36, width * .44, width * .10])
table.setStyle(TableStyle([
    ('GRID', (0, 0), (-1, -1), .6, colors.HexColor('#888888')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
_, h = table.wrap(width, H)
table.drawOn(c, L, y - h)
y -= h
assert y > 24, f'Content extends too low: {y}'
c.save()
FONT_TEMP.cleanup()
r = PdfReader(OUT)
assert len(r.pages) == 1
assert all(name in r.pages[0].extract_text() for name, *_ in projects)
print(f'Created {OUT} | 1 page | bottom margin {y:.1f} pt | {len(r.pages[0].get("/Annots", []))} links')
