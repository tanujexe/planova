/**
 * Client-Side AutoCAD DXF Exporter
 * Generates industry-standard AutoCAD Release 12 / 2000 DXF files with structured layers:
 * - WALLS (Exterior envelope & internal partitions)
 * - DOORS (Door leaves & swing clearance arcs)
 * - WINDOWS (Framed sills & glazing lines)
 * - FURNITURE (Architectural staging outlines)
 * - ROOM_LABELS (Room names, dimensions, and area)
 * - DIMENSIONS (Outer spans and room measurements)
 * - TITLE_BLOCK (Border frame & project title block)
 */

export class DxfBuilder {
  constructor(projectName = 'Planova Architectural Concept') {
    this.projectName = projectName;
    this.entities = [];
  }

  /**
   * Adds a LINE entity
   */
  addLine(x1, y1, x2, y2, layer = 'WALLS') {
    this.entities.push(`  0\nLINE\n  8\n${layer}\n 10\n${x1.toFixed(4)}\n 20\n${y1.toFixed(4)}\n 30\n0.0\n 11\n${x2.toFixed(4)}\n 21\n${y2.toFixed(4)}\n 31\n0.0`);
  }

  /**
   * Adds a closed RECTANGLE / LWPOLYLINE
   */
  addRect(x, y, width, height, layer = 'WALLS') {
    const x2 = x + width;
    const y2 = y + height;
    this.addLine(x, y, x2, y, layer);
    this.addLine(x2, y, x2, y2, layer);
    this.addLine(x2, y2, x, y2, layer);
    this.addLine(x, y2, x, y, layer);
  }

  /**
   * Adds an ARC entity (degrees 0-360)
   */
  addArc(cx, cy, radius, startAngle, endAngle, layer = 'DOORS') {
    this.entities.push(`  0\nARC\n  8\n${layer}\n 10\n${cx.toFixed(4)}\n 20\n${cy.toFixed(4)}\n 30\n0.0\n 40\n${radius.toFixed(4)}\n 50\n${startAngle.toFixed(2)}\n 51\n${endAngle.toFixed(2)}`);
  }

  /**
   * Adds a TEXT entity
   */
  addText(text, x, y, height = 0.8, layer = 'ROOM_LABELS', rotation = 0) {
    const cleanText = text.replace(/[\n\r]/g, ' ');
    this.entities.push(`  0\nTEXT\n  8\n${layer}\n 10\n${x.toFixed(4)}\n 20\n${y.toFixed(4)}\n 30\n0.0\n 40\n${height.toFixed(4)}\n  1\n${cleanText}\n 50\n${rotation}`);
  }

  /**
   * Compiles the complete DXF document string
   */
  build() {
    const header = `  0
SECTION
  2
HEADER
  9
$ACADVER
  1
AC1009
  9
$INSUNITS
 70
2
  0
ENDSEC
  0
SECTION
  2
TABLES
  0
TABLE
  2
LAYER
 70
7
  0
LAYER
  2
WALLS
 70
0
 62
7
  6
CONTINUOUS
  0
LAYER
  2
DOORS
 70
0
 62
1
  6
CONTINUOUS
  0
LAYER
  2
WINDOWS
 70
0
 62
4
  6
CONTINUOUS
  0
LAYER
  2
FURNITURE
 70
0
 62
3
  6
CONTINUOUS
  0
LAYER
  2
ROOM_LABELS
 70
0
 62
2
  6
CONTINUOUS
  0
LAYER
  2
DIMENSIONS
 70
0
 62
5
  6
CONTINUOUS
  0
LAYER
  2
TITLE_BLOCK
 70
0
 62
7
  6
CONTINUOUS
  0
ENDTAB
  0
ENDSEC
  0
SECTION
  2
ENTITIES
`;

    const footer = `  0
ENDSEC
  0
EOF
`;

    return header + this.entities.join('\n') + '\n' + footer;
  }
}

/**
 * Converts a FloorPlan project into a full DXF drawing
 * @param {object} project 
 * @returns {string} DXF file text content
 */
export const exportProjectToDxf = (project) => {
  const dxf = new DxfBuilder(project.name || 'Planova Concept');
  const plan = project.design || { plot: project.plot || { width: 30, length: 50 }, floors: [] };
  const plot = plan.plot || { width: 30, length: 50 };
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;

  // Outer Plot Perimeter Line on WALLS layer
  dxf.addRect(0, 0, plotW, plotL, 'WALLS');

  // Title Block & Outer Drawing Border
  const pad = 4;
  dxf.addRect(-pad, -pad, plotW + pad * 2, plotL + pad * 2, 'TITLE_BLOCK');
  dxf.addText(`PROJECT: ${project.name || 'Sharma Residence'}`, -pad + 1, -pad + 2.5, 0.9, 'TITLE_BLOCK');
  dxf.addText(`LOCATION: ${project.location || 'India'} | DATE: ${new Date().toLocaleDateString('en-IN')}`, -pad + 1, -pad + 1.2, 0.6, 'TITLE_BLOCK');
  dxf.addText(`PLANOVA AI CAD EXPORT - CONCEPTUAL ARCHITECTURAL SCHEMATIC`, -pad + 1, -pad + 0.2, 0.45, 'TITLE_BLOCK');

  // Dimension lines around plot
  dxf.addLine(0, plotL + 2, plotW, plotL + 2, 'DIMENSIONS');
  dxf.addText(`WIDTH: ${plotW}'-0"`, plotW / 2 - 3, plotL + 2.5, 0.7, 'DIMENSIONS');

  dxf.addLine(-2, 0, -2, plotL, 'DIMENSIONS');
  dxf.addText(`LENGTH: ${plotL}'-0"`, -2.8, plotL / 2, 0.7, 'DIMENSIONS', 90);

  // Process floors
  const floors = plan.floors || [];
  floors.forEach((floor, fIdx) => {
    const yOffset = fIdx * (plotL + pad * 3); // Stack upper floors side-by-side or above

    // Floor Label
    dxf.addText(`--- ${floor.label || `FLOOR LEVEL ${floor.level}`} ---`, 0, yOffset + plotL + 1, 0.9, 'TITLE_BLOCK');

    // Rooms
    (floor.rooms || []).map((room) => {
      const rx = room.x;
      const ry = yOffset + room.y;
      const rw = room.width;
      const rh = room.height;

      // Double-line walls (Outer box & inner offset for 9" / 4.5" thickness)
      dxf.addRect(rx, ry, rw, rh, 'WALLS');
      const wallThick = 0.5; // ft
      if (rw > 2 && rh > 2) {
        dxf.addRect(rx + wallThick, ry + wallThick, rw - wallThick * 2, rh - wallThick * 2, 'WALLS');
      }

      // Room Name & Area Labels
      const area = Math.round(rw * rh);
      dxf.addText(room.label.toUpperCase(), rx + rw / 2 - (room.label.length * 0.2), ry + rh / 2 + 0.5, 0.75, 'ROOM_LABELS');
      dxf.addText(`${rw}'-0" x ${rh}'-0" (${area} SQ.FT)`, rx + rw / 2 - 3.5, ry + rh / 2 - 0.7, 0.55, 'ROOM_LABELS');
    });

    // Doors & Windows
    (floor.openings || []).forEach((op) => {
      const parentRoom = (floor.rooms || []).find(r => r.id === op.wallRoomId);
      if (!parentRoom) return;

      const px = parentRoom.x;
      const py = yOffset + parentRoom.y;
      const opW = op.width || 3;
      const offset = op.offset || 2;

      if (op.type === 'door') {
        // Door leaf + 90° clearance arc
        let dx1 = px + offset;
        let dy1 = py;
        let dx2 = dx1 + opW;
        let dy2 = dy1;

        if (op.wallSide === 'bottom') {
          dy1 = py + parentRoom.height;
          dy2 = dy1;
        } else if (op.wallSide === 'left') {
          dx1 = px;
          dx2 = dx1;
          dy1 = py + offset;
          dy2 = dy1 + opW;
        } else if (op.wallSide === 'right') {
          dx1 = px + parentRoom.width;
          dx2 = dx1;
          dy1 = py + offset;
          dy2 = dy1 + opW;
        }

        dxf.addLine(dx1, dy1, dx2, dy2, 'DOORS');
        // Swing Arc
        dxf.addArc(dx1, dy1, opW, 0, 90, 'DOORS');
      } else if (op.type === 'window') {
        let wx1 = px + offset;
        let wy1 = py;
        let wx2 = wx1 + opW;
        let wy2 = wy1;

        if (op.wallSide === 'bottom') {
          wy1 = py + parentRoom.height;
          wy2 = wy1;
        } else if (op.wallSide === 'left') {
          wx1 = px;
          wx2 = wx1;
          wy1 = py + offset;
          wy2 = wy1 + opW;
        } else if (op.wallSide === 'right') {
          wx1 = px + parentRoom.width;
          wx2 = wx1;
          wy1 = py + offset;
          wy2 = wy1 + opW;
        }

        // Window parallel sill lines
        dxf.addLine(wx1, wy1, wx2, wy2, 'WINDOWS');
        dxf.addLine(wx1, wy1 + 0.3, wx2, wy2 + 0.3, 'WINDOWS');
      }
    });

    // Staged Furniture
    const floorFurniture = [
      ...(floor.furniture || []),
      ...(floor.rooms || []).flatMap(r => (r.furniture || []).map(f => ({ ...f, roomId: f.roomId || r.id })))
    ];
    floorFurniture.forEach((furn) => {
      const fx = furn.x;
      const fy = yOffset + furn.y;
      dxf.addRect(fx, fy, furn.width, furn.length, 'FURNITURE');
      dxf.addText(furn.label.split(' ')[0], fx + 0.3, fy + furn.length / 2, 0.45, 'FURNITURE');
    });
  });

  return dxf.build();
};

/**
 * Downloads a DXF file directly in the browser
 */
export const downloadDxfFile = (project) => {
  const dxfContent = exportProjectToDxf(project);
  const blob = new Blob([dxfContent], { type: 'application/dxf;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(project.name || 'planova-concept').replace(/\s+/g, '-').toLowerCase()}-drawing.dxf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
