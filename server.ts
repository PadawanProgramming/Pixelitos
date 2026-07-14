import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import postgres from "postgres";
import dotenv from "dotenv";
import { INITIAL_MATERIALS } from "./src/data/initialMaterials";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize postgres connection
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("CRITICAL ERROR: DATABASE_URL is not defined in environment.");
    process.exit(1);
  }

  const sql = postgres(DATABASE_URL, {
    ssl: "require",
  });

  // DB initialization helper
  async function initDb() {
    console.log("Initializing Neon Database...");
    try {
      // 1. Students Table
      await sql`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          level TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT,
          notes TEXT
        )
      `;

      // 2. Teachers Table
      await sql`
        CREATE TABLE IF NOT EXISTS teachers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          password TEXT,
          notes TEXT
        )
      `;

      // 3. Materials Table
      await sql`
        CREATE TABLE IF NOT EXISTS materials (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          tool TEXT NOT NULL,
          age_group TEXT NOT NULL,
          description TEXT,
          editor_url TEXT,
          is_favorite BOOLEAN DEFAULT FALSE,
          is_new BOOLEAN DEFAULT FALSE,
          notes TEXT,
          date_added TEXT,
          level TEXT,
          age_range TEXT,
          difficulty TEXT
        )
      `;

      // 4. Class Plans Table
      await sql`
        CREATE TABLE IF NOT EXISTS class_plans (
          id TEXT PRIMARY KEY,
          month TEXT NOT NULL,
          target_group TEXT NOT NULL,
          objectives TEXT NOT NULL,
          level TEXT,
          class_ids JSONB DEFAULT '[]'::jsonb,
          realized_class_ids JSONB DEFAULT '[]'::jsonb
        )
      `;

      // 5. Bulletins Table
      await sql`
        CREATE TABLE IF NOT EXISTS bulletins (
          id TEXT PRIMARY KEY,
          author TEXT NOT NULL,
          content TEXT NOT NULL,
          color TEXT,
          date TEXT NOT NULL
        )
      `;

      // 6. Resources Table
      await sql`
        CREATE TABLE IF NOT EXISTS resources (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          url TEXT NOT NULL,
          description TEXT
        )
      `;

      // 7. Accounts Table
      await sql`
        CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          platform TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          notes TEXT,
          level TEXT
        )
      `;

      console.log("Tables validated / created successfully.");

      // Seeding if tables are empty
      const studentCountResult = await sql`SELECT count(*)::int as count FROM students`;
      if (studentCountResult[0].count === 0) {
        console.log("Seeding default students...");
        const DEFAULT_STUDENTS = [
          {
            id: 'std-1',
            name: 'Mateo González',
            level: '1°1°',
            username: 'mateo_gonzalez_px',
            password: 'mateo123',
            notes: 'Asiste los lunes 18hs. Le encantan los proyectos de Scratch de laberintos.'
          },
          {
            id: 'std-2',
            name: 'Sofía Martínez',
            level: '1°2°',
            username: 'sofia_martinez_px',
            password: 'sofia123',
            notes: 'Tiene buen manejo del mouse, pasa rápido a desafíos intermedios.'
          },
          {
            id: 'std-3',
            name: 'Thiago Benítez',
            level: '2°1°',
            username: 'thiago_benitez_px',
            password: 'thiago123',
            notes: 'Interesado en robótica analógica con Micro:bit.'
          },
          {
            id: 'std-4',
            name: 'Valentina Rodríguez',
            level: '2°2°',
            username: 'valentina_rodriguez_px',
            password: 'valen123',
            notes: 'Nivel avanzado Roblox Studio. Gran capacidad de abstracción.'
          }
        ];
        for (const std of DEFAULT_STUDENTS) {
          await sql`
            INSERT INTO students (id, name, level, username, password, notes)
            VALUES (${std.id}, ${std.name}, ${std.level}, ${std.username}, ${std.password}, ${std.notes})
          `;
        }
      }

      const teacherCountResult = await sql`SELECT count(*)::int as count FROM teachers`;
      if (teacherCountResult[0].count === 0) {
        console.log("Seeding default teachers...");
        const DEFAULT_TEACHERS = [
          { id: 't-1', name: 'Profesor Principal', password: 'profe', notes: 'Profesor titular del taller de robótica.' },
          { id: 't-2', name: 'Profe Auxiliar', password: 'profe2026', notes: 'Asistente de Scratch y Pilas Bloques.' }
        ];
        for (const t of DEFAULT_TEACHERS) {
          await sql`
            INSERT INTO teachers (id, name, password, notes)
            VALUES (${t.id}, ${t.name}, ${t.password}, ${t.notes})
          `;
        }
      }

      const materialCountResult = await sql`SELECT count(*)::int as count FROM materials`;
      if (materialCountResult[0].count === 0) {
        console.log("Seeding initial educational materials...");
        for (const m of INITIAL_MATERIALS) {
          await sql`
            INSERT INTO materials (
              id, title, url, tool, age_group, description, editor_url, 
              is_favorite, is_new, notes, date_added, level, age_range, difficulty
            ) VALUES (
              ${m.id}, ${m.title}, ${m.url}, ${m.tool}, ${m.ageGroup || 'Todos / General'}, ${m.description || null}, ${m.editorUrl || null},
              ${m.isFavorite || false}, ${m.isNew || false}, ${m.notes || null}, ${m.dateAdded || null}, ${m.level || null},
              ${m.ageRange || null}, ${m.difficulty || null}
            )
          `;
        }
      }

      const accountCountResult = await sql`SELECT count(*)::int as count FROM accounts`;
      if (accountCountResult[0].count === 0) {
        console.log("Seeding default accounts...");
        const DEFAULT_ACCOUNTS = [
          {
            id: 'acc-1',
            name: 'Cuenta Profe Principal Scratch',
            type: 'Profe',
            platform: 'Scratch',
            username: 'pixelitos_profes_2026',
            password: 'PixelitosScratchPass!',
            notes: 'Uso general para guardar plantillas de clase. ¡Cuidado de no modificar los proyectos base!',
            level: null
          },
          {
            id: 'acc-2',
            name: 'Licencias Estudiantes Roblox Studio Nivel 2°2°',
            type: 'Alumno',
            platform: 'Roblox',
            username: 'pixelitos_estudiante_roblox_22',
            password: 'RobloxStudent9921',
            notes: 'Compartido para los chicos de Roblox del grupo de las 18hs.',
            level: '2°2%'
          }
        ];
        for (const acc of DEFAULT_ACCOUNTS) {
          await sql`
            INSERT INTO accounts (id, name, type, platform, username, password, notes, level)
            VALUES (${acc.id}, ${acc.name}, ${acc.type}, ${acc.platform}, ${acc.username}, ${acc.password}, ${acc.notes}, ${acc.level})
          `;
        }
      }

      // Bulletins
      const bulletinCountResult = await sql`SELECT count(*)::int as count FROM bulletins`;
      if (bulletinCountResult[0].count === 0) {
        console.log("Seeding default bulletins...");
        const DEFAULT_BULLETINS = [
          {
            id: 'msg-1',
            author: 'Guille (Coordinación)',
            text: '¡Hola profes! Recuerden que la cuenta compartida de Scratch es "profespixelitos" con contraseña "pixelitos123". ¡No la cambien así todos pueden entrar!',
            color: 'yellow',
            date: '08/07/2026',
          },
          {
            id: 'msg-2',
            author: 'Antu (Profe)',
            text: 'El proyecto "Esquivar Autos" lo probé con chicos de 10 años y les encantó. Tip: explíquenles primero cómo funciona el bloque de sumar a X/Y antes de arrancar.',
            color: 'cyan',
            date: '07/07/2026',
          },
          {
            id: 'msg-3',
            author: 'Fio (Coordinación)',
            text: '¡Jefas! Ya organicé las carpetas de Drive para el material de soporte no presencial. Cualquier cosa me avisan si falta algún PDF.',
            color: 'pink',
            date: '05/07/2026',
          },
          {
            id: 'msg-4',
            author: 'Guille (Coordinación)',
            text: 'Regla de Oro: En clase trabajemos siempre con copias de los proyectos originales. Así los preservamos limpios para las siguientes comisiones.',
            color: 'green',
            date: '04/07/2026',
          }
        ];
        for (const b of DEFAULT_BULLETINS) {
          await sql`
            INSERT INTO bulletins (id, author, content, color, date)
            VALUES (${b.id}, ${b.author}, ${b.text}, ${b.color}, ${b.date})
          `;
        }
      }

      console.log("Database seeded successfully.");
    } catch (error) {
      console.error("Error during database initialization/seeding:", error);
    }
  }

  // Call the DB init helper
  await initDb();

  // Mappers
  function mapStudentFromDb(row: any) {
    return {
      id: row.id,
      name: row.name,
      level: row.level,
      username: row.username,
      password: row.password,
      notes: row.notes
    };
  }

  function mapTeacherFromDb(row: any) {
    return {
      id: row.id,
      name: row.name,
      password: row.password,
      notes: row.notes
    };
  }

  function mapMaterialFromDb(row: any) {
    return {
      id: row.id,
      title: row.title,
      url: row.url,
      tool: row.tool,
      ageGroup: row.age_group,
      description: row.description,
      editorUrl: row.editor_url,
      isFavorite: !!row.is_favorite,
      isNew: !!row.is_new,
      notes: row.notes,
      dateAdded: row.date_added,
      level: row.level,
      ageRange: row.age_range,
      difficulty: row.difficulty
    };
  }

  function mapPlanFromDb(row: any) {
    return {
      id: row.id,
      month: row.month,
      targetGroup: row.target_group,
      objectives: row.objectives,
      level: row.level,
      classIds: row.class_ids || [],
      realizedClassIds: row.realized_class_ids || []
    };
  }

  function mapBulletinFromDb(row: any) {
    return {
      id: row.id,
      author: row.author,
      text: row.content,
      color: row.color,
      date: row.date
    };
  }

  function mapResourceFromDb(row: any) {
    return {
      id: row.id,
      title: row.title,
      type: row.type,
      url: row.url,
      description: row.description
    };
  }

  function mapAccountFromDb(row: any) {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      platform: row.platform,
      username: row.username,
      password: row.password,
      notes: row.notes,
      level: row.level
    };
  }

  // API ROUTES

  // Students
  app.get("/api/students", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM students ORDER BY name ASC`;
      res.json(rows.map(mapStudentFromDb));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const { id, name, level, username, password, notes } = req.body;
      await sql`
        INSERT INTO students (id, name, level, username, password, notes)
        VALUES (${id}, ${name}, ${level}, ${username}, ${password || null}, ${notes || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          level = EXCLUDED.level,
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          notes = EXCLUDED.notes
      `;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      await sql`DELETE FROM students WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Teachers
  app.get("/api/teachers", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM teachers ORDER BY name ASC`;
      res.json(rows.map(mapTeacherFromDb));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/teachers", async (req, res) => {
    try {
      const { id, name, password, notes } = req.body;
      await sql`
        INSERT INTO teachers (id, name, password, notes)
        VALUES (${id}, ${name}, ${password || null}, ${notes || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          password = EXCLUDED.password,
          notes = EXCLUDED.notes
      `;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/teachers/:id", async (req, res) => {
    try {
      await sql`DELETE FROM teachers WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Materials
  app.get("/api/materials", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM materials ORDER BY title ASC`;
      res.json(rows.map(mapMaterialFromDb));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/materials", async (req, res) => {
    try {
      const m = req.body;
      await sql`
        INSERT INTO materials (
          id, title, url, tool, age_group, description, editor_url, 
          is_favorite, is_new, notes, date_added, level, age_range, difficulty
        ) VALUES (
          ${m.id}, ${m.title}, ${m.url}, ${m.tool}, ${m.ageGroup || 'Todos / General'}, ${m.description || null}, ${m.editorUrl || null},
          ${m.isFavorite || false}, ${m.isNew || false}, ${m.notes || null}, ${m.dateAdded || null}, ${m.level || null},
          ${m.ageRange || null}, ${m.difficulty || null}
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          url = EXCLUDED.url,
          tool = EXCLUDED.tool,
          age_group = EXCLUDED.age_group,
          description = EXCLUDED.description,
          editor_url = EXCLUDED.editor_url,
          is_favorite = EXCLUDED.is_favorite,
          is_new = EXCLUDED.is_new,
          notes = EXCLUDED.notes,
          date_added = EXCLUDED.date_added,
          level = EXCLUDED.level,
          age_range = EXCLUDED.age_range,
          difficulty = EXCLUDED.difficulty
      `;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Batch insert/reset materials
  app.post("/api/materials/batch", async (req, res) => {
    try {
      const { materials } = req.body;
      if (!Array.isArray(materials)) {
        return res.status(400).json({ error: "materials must be an array" });
      }

      // We wrap the operations in a single transaction for atomicity and speed!
      await sql.begin(async (sqlTrans) => {
        // Drop existing and replace, or upsert. Let's truncate and reload for true reset to default state when requested
        await sqlTrans`TRUNCATE TABLE materials`;
        for (const m of materials) {
          await sqlTrans`
            INSERT INTO materials (
              id, title, url, tool, age_group, description, editor_url, 
              is_favorite, is_new, notes, date_added, level, age_range, difficulty
            ) VALUES (
              ${m.id}, ${m.title}, ${m.url}, ${m.tool}, ${m.ageGroup || 'Todos / General'}, ${m.description || null}, ${m.editorUrl || null},
              ${m.isFavorite || false}, ${m.isNew || false}, ${m.notes || null}, ${m.dateAdded || null}, ${m.level || null},
              ${m.ageRange || null}, ${m.difficulty || null}
            )
          `;
        }
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/materials/:id", async (req, res) => {
    try {
      await sql`DELETE FROM materials WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Class Plans
  app.get("/api/class-plans", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM class_plans ORDER BY month ASC`;
      res.json(rows.map(mapPlanFromDb));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/class-plans", async (req, res) => {
    try {
      const p = req.body;
      await sql`
        INSERT INTO class_plans (id, month, target_group, objectives, level, class_ids, realized_class_ids)
        VALUES (${p.id}, ${p.month}, ${p.targetGroup}, ${p.objectives}, ${p.level || null}, ${JSON.stringify(p.classIds || [])}, ${JSON.stringify(p.realizedClassIds || [])})
        ON CONFLICT (id) DO UPDATE SET
          month = EXCLUDED.month,
          target_group = EXCLUDED.target_group,
          objectives = EXCLUDED.objectives,
          level = EXCLUDED.level,
          class_ids = EXCLUDED.class_ids,
          realized_class_ids = EXCLUDED.realized_class_ids
      `;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/class-plans/:id", async (req, res) => {
    try {
      await sql`DELETE FROM class_plans WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bulletins
  app.get("/api/bulletins", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM bulletins ORDER BY date DESC`;
      res.json(rows.map(mapBulletinFromDb));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/bulletins", async (req, res) => {
    try {
      const b = req.body;
      await sql`
        INSERT INTO bulletins (id, author, content, color, date)
        VALUES (${b.id}, ${b.author}, ${b.text}, ${b.color || null}, ${b.date})
        ON CONFLICT (id) DO UPDATE SET
          author = EXCLUDED.author,
          content = EXCLUDED.content,
          color = EXCLUDED.color,
          date = EXCLUDED.date
      `;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/bulletins/:id", async (req, res) => {
    try {
      await sql`DELETE FROM bulletins WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Resources
  app.get("/api/resources", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM resources ORDER BY title ASC`;
      res.json(rows.map(mapResourceFromDb));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const r = req.body;
      await sql`
        INSERT INTO resources (id, title, type, url, description)
        VALUES (${r.id}, ${r.title}, ${r.type}, ${r.url}, ${r.description || null})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          type = EXCLUDED.type,
          url = EXCLUDED.url,
          description = EXCLUDED.description
      `;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      await sql`DELETE FROM resources WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Accounts
  app.get("/api/accounts", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM accounts ORDER BY name ASC`;
      res.json(rows.map(mapAccountFromDb));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const a = req.body;
      await sql`
        INSERT INTO accounts (id, name, type, platform, username, password, notes, level)
        VALUES (${a.id}, ${a.name}, ${a.type}, ${a.platform}, ${a.username}, ${a.password}, ${a.notes || null}, ${a.level || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          platform = EXCLUDED.platform,
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          notes = EXCLUDED.notes,
          level = EXCLUDED.level
      `;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      await sql`DELETE FROM accounts WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // Serve assets or pass requests to Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
