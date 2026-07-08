import { jsPDF } from 'jspdf';
import { EducationalMaterial, enrichMaterial } from '../types';

export function exportProjectsToPDF(
  materials: EducationalMaterial[],
  currentFilters: {
    level: string;
    tool: string;
    difficulty: string;
    ageRange: string;
    searchQuery: string;
  }
) {
  // 1. Initialize jsPDF (A4 Portrait, measurements in mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Enrich materials first to ensure proper levels, ageRanges, difficulties are processed
  const enrichedList = materials.map(m => enrichMaterial(m));

  // 2. Filter list according to parameters
  const filteredList = enrichedList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(currentFilters.searchQuery.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(currentFilters.searchQuery.toLowerCase()) ||
      m.tool.toLowerCase().includes(currentFilters.searchQuery.toLowerCase());

    const matchesTool = currentFilters.tool === 'Todos' || m.tool === currentFilters.tool;
    const matchesLevel = currentFilters.level === 'Todos' || m.level === currentFilters.level;
    const matchesAgeRange = currentFilters.ageRange === 'Todos' || m.ageRange === currentFilters.ageRange;
    const matchesDifficulty = currentFilters.difficulty === 'Todos' || m.difficulty === currentFilters.difficulty;

    return matchesSearch && matchesTool && matchesLevel && matchesAgeRange && matchesDifficulty;
  });

  // 3. Define layout parameters
  const marginX = 15;
  let posY = 20;
  const pageHeight = 297; // A4 height in mm
  const pageWidth = 210; // A4 width in mm
  const contentWidth = pageWidth - marginX * 2; // 180mm

  // Helper function to check space and add a page if necessary
  const checkPageBreak = (neededHeight: number) => {
    if (posY + neededHeight > pageHeight - 20) {
      doc.addPage();
      posY = 20;
      drawPageFooter();
      drawHeaderBorder();
      return true;
    }
    return false;
  };

  // Helper to draw a tiny accent bar on top of pages
  const drawHeaderBorder = () => {
    doc.setFillColor(240, 218, 76); // Pixelitos Yellow: rgb(240, 218, 76)
    doc.rect(marginX, 10, contentWidth, 2, 'F');
  };

  // Helper to draw the page footer with page number
  const drawPageFooter = () => {
    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pixelitos Academy — Catálogo de Materiales Educativos — Exportado el ${new Date().toLocaleDateString()}`,
      marginX,
      pageHeight - 10
    );
    doc.text(
      `Página ${totalPages}`,
      pageWidth - marginX - 15,
      pageHeight - 10
    );
  };

  // --- DRAW TITLE COVER / HEADER BANNER ---
  drawHeaderBorder();

  // Yellow Side Accent Box for branding
  doc.setFillColor(240, 218, 76); // rgb(240, 218, 76)
  doc.rect(marginX, posY, 4, 18, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('PIXELITOS', marginX + 8, posY + 6);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Catálogo de Materiales Pedagógicos y Desafíos de Clase', marginX + 8, posY + 13);

  posY += 24;

  // Metadata Box with active filters info
  doc.setFillColor(248, 250, 252); // slate-50 background
  doc.setDrawColor(226, 232, 240); // slate-200 border
  doc.rect(marginX, posY, contentWidth, 24, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate-700
  doc.text('Detalles del Reporte:', marginX + 5, posY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  const filterText = `Filtros Aplicados: Plataforma: ${currentFilters.tool} | Nivel: ${currentFilters.level} | Edad: ${currentFilters.ageRange} | Dificultad: ${currentFilters.difficulty}`;
  const searchInfoText = currentFilters.searchQuery ? `Búsqueda de texto: "${currentFilters.searchQuery}"` : 'Sin búsqueda de texto libre';
  doc.text(filterText, marginX + 5, posY + 12);
  doc.text(searchInfoText, marginX + 5, posY + 17);
  doc.text(`Proyectos Encontrados: ${filteredList.length} de ${materials.length} totales.`, marginX + 5, posY + 21);

  posY += 32;

  // --- GROUPING & RENDERING BY LEVEL ---
  const levels: ('1°1°' | '1°2°' | '2°1°' | '2°2°')[] = ['1°1°', '1°2°', '2°1°', '2°2°'];

  levels.forEach((lvl) => {
    // Get materials for this level
    const levelMaterials = filteredList.filter((m) => m.level === lvl);
    if (levelMaterials.length === 0) return; // Skip levels with no projects matching filters

    checkPageBreak(15);

    // Draw Level Header Section
    doc.setFillColor(30, 41, 59); // Slate-800 background for level dividers
    doc.rect(marginX, posY, contentWidth, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // White text

    let levelLabel = '';
    if (lvl === '1°1°') levelLabel = 'NIVEL 1°1° — Pequeños (Scratch Inicial, Pilas Bloques, Code.org)';
    else if (lvl === '1°2°') levelLabel = 'NIVEL 1°2° — Iniciación General (Scratch Base)';
    else if (lvl === '2°1°') levelLabel = 'NIVEL 2°1° — Intermedio (Scratch Avanzado / Clones / Variables)';
    else if (lvl === '2°2°') levelLabel = 'NIVEL 2°2° — Avanzado (Roblox Studio / Micro:bit)';

    doc.text(levelLabel, marginX + 4, posY + 5.5);
    posY += 13;

    // Render each material in this level
    levelMaterials.forEach((m, idx) => {
      // Estimate heights to prevent ugly orphans/page break clips
      // Standard item uses: Title (5mm), Metadata (4mm), Description paragraphs (approx 15mm), Tips box (approx 12mm)
      // Let's safe-test with 30mm height check
      checkPageBreak(30);

      // 1. Draw Index & Project Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate-900
      const titleLine = `${idx + 1}. ${m.title}`;
      doc.text(titleLine, marginX, posY);

      // Right-aligned Tool tag
      const toolText = `[ ${m.tool.toUpperCase()} ]`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(217, 119, 6); // Amber dark
      doc.text(toolText, pageWidth - marginX - doc.getTextWidth(toolText), posY);

      posY += 5.5;

      // 2. Metadata sub-labels (Age Range, Difficulty)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const metaText = `Edad: ${m.ageRange || 'General'}   |   Dificultad: ${(m.difficulty || 'bajo').toUpperCase()}   |   URL: ${m.url}`;
      doc.text(metaText, marginX, posY);

      posY += 5;

      // 3. Project Description/Consigna
      if (m.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85); // Slate-700
        
        const descLines = doc.splitTextToSize(m.description, contentWidth);
        doc.text(descLines, marginX, posY);
        posY += descLines.length * 4 + 2;
      }

      // 4. Notes/Tips (Indented Block)
      if (m.notes) {
        checkPageBreak(12);

        // Light background for notes
        const notesWidth = contentWidth - 6;
        const notesLines = doc.splitTextToSize(`Tips Docente: ${m.notes}`, notesWidth - 6);
        const boxHeight = notesLines.length * 4 + 5;

        doc.setFillColor(254, 252, 232); // Light yellow-ish background (yellow-50)
        doc.setDrawColor(253, 224, 71); // Border yellow-300
        doc.rect(marginX + 3, posY, notesWidth, boxHeight, 'FD');

        doc.setFont('helvetica', 'oblique');
        doc.setFontSize(7.5);
        doc.setTextColor(133, 77, 14); // Dark gold notes text
        doc.text(notesLines, marginX + 6, posY + 4);

        posY += boxHeight + 4;
      }

      posY += 3; // tiny gap between cards
    });

    posY += 5; // spacing after level block
  });

  // Finalize PDF rendering (Add footers to all pages dynamically)
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter();
  }

  // 4. Save/Download Trigger
  const sanitizedName = `pixelitos_proyectos_${currentFilters.level.replace('/', '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(sanitizedName);
}
