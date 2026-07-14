export type ToolType =
  | 'Scratch'
  | 'Kahoot'
  | 'Roblox Studio'
  | 'Micro:bit'
  | 'Tynker'
  | 'Code.org'
  | 'Pilas Bloques'
  | 'Recursos y Guías';

export type AgeGroupType =
  | 'Pequeños (1° 1 / 7-8 años)'
  | 'Medianos (8-12 años)'
  | 'Cierre y Diagnósticos'
  | 'Todos / General';

export type LevelType = '1°1°' | '1°2°' | '2°1°' | '2°2°';
export type AgeRangeType = '7-9 años' | '10-12 años';
export type DifficultyType = 'bajo' | 'intermedio' | 'alto';

export type UserRole = 'public' | 'alumno' | 'profesor' | 'admin';

export interface UserSession {
  role: UserRole;
  studentLevel?: LevelType;
  studentName?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  level: LevelType;
  username: string; // generated automatic key
  password?: string;
  notes?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  password?: string;
  notes?: string;
}


export interface EducationalMaterial {
  id: string;
  title: string;
  url: string;
  tool: ToolType;
  ageGroup: AgeGroupType; // legacy
  description?: string;
  editorUrl?: string; // e.g. /editor URL if available
  isFavorite?: boolean;
  isNew?: boolean;
  notes?: string; // Optional teacher-submitted notes/feedback
  dateAdded?: string;
  level?: LevelType;
  ageRange?: AgeRangeType;
  difficulty?: DifficultyType;
}

export interface TeacherMessage {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface ProjectStats {
  total: number;
  byTool: Record<ToolType, number>;
  byAgeGroup: Record<AgeGroupType, number>;
}

export function enrichMaterial(m: EducationalMaterial): EducationalMaterial {
  const enriched = { ...m };

  if (!enriched.level) {
    const titleLower = m.title.toLowerCase();
    const descLower = (m.description || '').toLowerCase();
    
    if (m.tool === 'Code.org' || m.tool === 'Pilas Bloques') {
      enriched.level = '1°1°';
    } else if (m.tool === 'Scratch') {
      if (m.ageGroup && m.ageGroup.includes('Pequeños')) {
        enriched.level = '1°1°';
      } else if (
        titleLower.includes('clones') ||
        titleLower.includes('arkanoid') ||
        titleLower.includes('funciones') ||
        titleLower.includes('difícil') ||
        titleLower.includes('plataformas') ||
        titleLower.includes('galáctica') ||
        titleLower.includes('karts') ||
        titleLower.includes('ra-')
      ) {
        enriched.level = '2°1°';
      } else {
        enriched.level = '1°2°';
      }
    } else if (m.tool === 'Roblox Studio') {
      enriched.level = '2°2°';
    } else if (m.tool === 'Micro:bit') {
      enriched.level = '2°2°';
    } else if (m.tool === 'Kahoot') {
      if (titleLower.includes('nivel 1') || (m.ageGroup && m.ageGroup.includes('Pequeños'))) {
        enriched.level = '1°1°';
      } else if (titleLower.includes('roblox') || titleLower.includes('micro:bit') || titleLower.includes('lua')) {
        enriched.level = '2°2°';
      } else if (titleLower.includes('nivel 2') || titleLower.includes('clones') || titleLower.includes('arkanoid')) {
        enriched.level = '2°1°';
      } else {
        enriched.level = '1°2°';
      }
    } else {
      enriched.level = '1°2°';
    }
  }

  if (!enriched.ageRange) {
    if (enriched.level === '1°1°') {
      enriched.ageRange = '7-9 años';
    } else {
      enriched.ageRange = '10-12 años';
    }
  }

  if (!enriched.difficulty) {
    const titleLower = m.title.toLowerCase();
    if (enriched.level === '1°1°') {
      enriched.difficulty = 'bajo';
    } else if (enriched.level === '1°2°') {
      if (titleLower.includes('difícil') || titleLower.includes('complejo') || titleLower.includes('arkanoid')) {
        enriched.difficulty = 'alto';
      } else if (titleLower.includes('intermedio') || titleLower.includes('bichos') || titleLower.includes('monedas')) {
        enriched.difficulty = 'intermedio';
      } else {
        enriched.difficulty = 'bajo';
      }
    } else if (enriched.level === '2°1°') {
      if (titleLower.includes('funciones') || titleLower.includes('clones') || titleLower.includes('plataformas')) {
        enriched.difficulty = 'alto';
      } else {
        enriched.difficulty = 'intermedio';
      }
    } else {
      // 2°2° (Roblox, Microbit advanced)
      if (titleLower.includes('scripting') || titleLower.includes('radio') || titleLower.includes('computacional')) {
        enriched.difficulty = 'alto';
      } else {
        enriched.difficulty = 'intermedio';
      }
    }
  }

  return enriched;
}
