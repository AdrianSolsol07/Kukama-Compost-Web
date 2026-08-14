from io import BytesIO
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "tmp" / "pdfs" / "membrete-kc.pdf"
OUT = ROOT / "output" / "pdf" / "carta-compromiso-voluntariado-kukama.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = A4
GREEN = HexColor("#245d43")
INK = HexColor("#17392c")
MUTED = HexColor("#5d7067")
LIME = HexColor("#b8d875")

packet = BytesIO()
c = canvas.Canvas(packet, pagesize=A4)

def centered(text, y, size, color=INK, font="Helvetica-Bold"):
    c.setFillColor(color); c.setFont(font, size); c.drawCentredString(W/2, y, text)

def wrapped(text, x, y, max_width, leading=14, size=9.5):
    c.setFillColor(INK); c.setFont("Helvetica", size)
    words, line, lines = text.split(), "", []
    for word in words:
        trial = f"{line} {word}".strip()
        if c.stringWidth(trial, "Helvetica", size) <= max_width: line = trial
        else: lines.append(line); line = word
    if line: lines.append(line)
    for item in lines:
        c.drawString(x, y, item); y -= leading
    return y

centered("VOLUNTARIADO CON PROPÓSITO", 700, 7.5, GREEN)
centered("CARTA DE COMPROMISO DE VOLUNTARIADO", 678, 18)
centered("Ley N.° 28238 - Ley General del Voluntariado del Perú", 660, 8.5, MUTED, "Helvetica")
c.setFillColor(MUTED); c.setFont("Helvetica", 8.5); c.drawRightString(540, 630, "Iquitos, ____ de __________________ de 20____")

y = wrapped("Yo, ____________________________________________, identificado/a con DNI o documento N.° ____________, teléfono ________________ y correo electrónico ________________________________, manifiesto libremente mi voluntad de participar como voluntario/a en Kukama Compost.", 55, 600, 485)

y -= 12
c.setFillColor(HexColor("#f7faef")); c.roundRect(55, y-62, 485, 68, 7, fill=1, stroke=0)
c.setStrokeColor(HexColor("#dce4cf")); c.roundRect(55, y-62, 485, 68, 7, fill=0, stroke=1)
c.setFillColor(GREEN); c.setFont("Helvetica-Bold", 8); c.drawString(68, y-10, "DATOS DEL COMPROMISO")
c.setFillColor(MUTED); c.setFont("Helvetica", 8); c.drawString(68, y-32, "Área de participación"); c.drawString(310, y-32, "Disponibilidad")
c.setFillColor(INK); c.drawString(68, y-48, "____________________________"); c.drawString(310, y-48, "____________________________")
y -= 84
y = wrapped("Me comprometo a actuar con responsabilidad, respeto, solidaridad y cuidado del territorio; cumplir las coordinaciones y medidas de seguridad de cada actividad; tratar con dignidad a las personas y comunidades; y comunicar oportunamente cualquier situación que limite mi participación.", 55, y, 485)
y -= 8
y = wrapped("Comprendo que esta colaboración es libre, solidaria y no remunerada, y que no sustituye una relación laboral. Autorizo el uso de mis datos únicamente para la organización y seguimiento de las actividades de voluntariado, conforme a la normativa aplicable.", 55, y, 485)

sig_y = max(260, y-52)
c.setStrokeColor(INK); c.line(85, sig_y, 255, sig_y); c.line(340, sig_y, 510, sig_y)
c.setFillColor(MUTED); c.setFont("Helvetica", 7.5); c.drawCentredString(170, sig_y-12, "Firma del/de la voluntario/a"); c.drawCentredString(425, sig_y-12, "Representante de Kukama Compost")
c.setStrokeColor(LIME); c.setLineWidth(2); c.line(145, sig_y-34, 450, sig_y-34)
centered("Sembramos compromiso, transformamos territorio.", sig_y-46, 7.5, GREEN, "Helvetica-Bold")
c.save()

packet.seek(0)
base = PdfReader(str(BASE))
overlay = PdfReader(packet)
page = base.pages[0]
page.merge_page(overlay.pages[0])
writer = PdfWriter(); writer.add_page(page)
with open(OUT, "wb") as f: writer.write(f)
print(OUT)
