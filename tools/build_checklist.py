"""Builds src/downloads/ai-automation-starter-checklist.pdf from tools/checklist.md.
Run: python3 tools/build_checklist.py   (needs: pip install reportlab)"""
import os, re, sys
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                KeepTogether, Flowable)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools', 'checklist.md')
OUT = os.path.join(ROOT, 'src', 'downloads', 'ai-automation-starter-checklist.pdf')
NAVY, BLUE, TEXT, MUTED, LINE = map(colors.HexColor, ['#0a1228', '#1479d6', '#1b2333', '#5a6478', '#d5dbe6'])

body = ParagraphStyle('b', fontName='Helvetica', fontSize=10.5, leading=15.5, textColor=TEXT, spaceAfter=7)
h1 = ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=25, leading=30, textColor=NAVY, spaceAfter=12)
h2 = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=14.5, leading=19, textColor=BLUE, spaceBefore=14, spaceAfter=6)
item = ParagraphStyle('i', parent=body, spaceAfter=0)
cell = ParagraphStyle('c', parent=body, fontSize=9.5, leading=13, spaceAfter=0)
cellh = ParagraphStyle('ch', parent=cell, fontName='Helvetica-Bold', textColor=colors.white)

class Box(Flowable):
    def __init__(self, check): self.check, self.width, self.height = check, 12, 12
    def draw(self):
        c = self.canv
        if self.check:
            c.setStrokeColor(BLUE); c.setLineWidth(1); c.roundRect(0, 0.5, 9.5, 9.5, 1.5)
        else:
            c.setFillColor(BLUE); c.circle(4.5, 5.5, 1.8, stroke=0, fill=1)

class Button(Flowable):
    """A clickable button: a markdown line that is only [label](url)."""
    def __init__(self, label, url):
        self.label, self.url = label, url
        self.url_text = url.replace('https://', '')
        self.width, self.height = 170 * mm, 20 * mm
    def draw(self):
        c = self.canv
        w = c.stringWidth(self.label, 'Helvetica-Bold', 11.5) + 16 * mm
        c.setFillColor(BLUE); c.roundRect(0, 8 * mm, w, 11 * mm, 5, stroke=0, fill=1)
        c.setFillColor(colors.white); c.setFont('Helvetica-Bold', 11.5)
        c.drawString(6 * mm, 12 * mm, self.label)
        c.linkURL(self.url, (0, 8 * mm, w, 19 * mm), relative=1)
        c.setFillColor(BLUE); c.setFont('Helvetica', 9.5); c.drawString(0, 1.5 * mm, self.url_text)
        tw = c.stringWidth(self.url_text, 'Helvetica', 9.5)
        c.setStrokeColor(BLUE); c.setLineWidth(.5); c.line(0, 1 * mm, tw, 1 * mm)
        c.linkURL(self.url, (0, 0, tw, 5 * mm), relative=1)

def row(text, check):
    t = Table([[Box(check), Paragraph(escape(text), item)]], colWidths=[7 * mm, 163 * mm])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0),
                           ('TOPPADDING', (0, 0), (-1, -1), 2.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
                           ('TOPPADDING', (0, 0), (0, 0), 4.5)]))
    return t

def table(rows):
    n = len(rows[0]); w = 170 * mm
    widths = [w * .46, w * .54] if n == 2 else [w * .4] + [w * .2] * 3
    data = [[Paragraph(escape(c), cellh if i == 0 else cell) for c in r] for i, r in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1, rowHeights=None if n == 2 else [None] + [9 * mm] * (len(rows) - 1))
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), NAVY), ('GRID', (0, 0), (-1, -1), .5, LINE),
                           ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('TOPPADDING', (0, 0), (-1, -1), 5),
                           ('BOTTOMPADDING', (0, 0), (-1, -1), 5), ('LEFTPADDING', (0, 0), (-1, -1), 7)]))
    return t

def parse(lines):
    out, section, tbl = [], [], []
    def flush_tbl():
        if tbl: section.extend([table(list(tbl)), Spacer(1, 8)]); tbl.clear()
    def flush():
        flush_tbl()
        if section: out.append(KeepTogether(list(section))); section.clear()
    for ln in lines:
        ln = ln.rstrip('\n')
        if ln.startswith('|'):
            cells = [c.strip() for c in ln.strip('|').split('|')]
            if not all(set(c) <= set('- ') for c in cells): tbl.append(cells)
            continue
        flush_tbl()
        if ln.startswith('# '): section.append(Paragraph(escape(ln[2:]), h1))
        elif ln.startswith('## '): flush(); section.append(Paragraph(escape(ln[3:]), h2))
        elif ln.startswith('- [ ] '): section.append(row(ln[6:], True))
        elif ln.startswith('- '): section.append(row(ln[2:], False))
        elif re.fullmatch(r'\[(.+)\]\((https?://\S+)\)', ln.strip()):
            m = re.fullmatch(r'\[(.+)\]\((https?://\S+)\)', ln.strip()); section.extend([Spacer(1, 6), Button(m.group(1), m.group(2))])
        elif ln.strip(): section.extend([Spacer(1, 3), Paragraph(escape(ln), body)])
    flush()
    return out

def frame(c, d):
    w, h = A4
    c.setFillColor(NAVY); c.rect(0, h - 14 * mm, w, 14 * mm, stroke=0, fill=1)
    c.setFillColor(colors.white); c.setFont('Helvetica-Bold', 11); c.drawString(20 * mm, h - 9 * mm, 'Squar')
    c.setFillColor(colors.HexColor('#2ea2ff')); c.drawString(20 * mm + c.stringWidth('Squar', 'Helvetica-Bold', 11), h - 9 * mm, 'Finity')
    c.setFillColor(colors.HexColor('#aeb8cc')); c.setFont('Helvetica', 8.5)
    c.drawRightString(w - 20 * mm, h - 9 * mm, 'AI Automation Starter Checklist')
    c.setFillColor(MUTED); c.drawString(20 * mm, 11 * mm, 'squarfinity.com')
    c.drawRightString(w - 20 * mm, 11 * mm, 'Page %d' % d.page)

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm, topMargin=26 * mm, bottomMargin=20 * mm,
                        title='The AI Automation Starter Checklist', author='SquarFinity')
doc.build(parse(open(SRC, encoding='utf-8')), onFirstPage=frame, onLaterPages=frame)
print('wrote', OUT, os.path.getsize(OUT), 'bytes')
