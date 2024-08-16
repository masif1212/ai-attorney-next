// lib/loadData.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

export async function getDatabaseConnection(dbName: string) {
  const dbPath = path.join(process.cwd(), 'data', dbName);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return db;
}

export async function loadData() {
  const dataFolder = path.join(process.cwd(), 'data');
  const dbFiles = fs.readdirSync(dataFolder).filter(file => file.endsWith('.db'));

  const allData: any[] = [];

  for (const dbFile of dbFiles) {
    const db = await getDatabaseConnection(dbFile);

    const rows = await db.all(`
      SELECT id, order_num, citation, title, court, year, page_no, citation_name, referLinks, related_case_type, description, case_description, case_facts, case_judgements, case_proceedings, keywords, judges, parties_involved, summary, case_type, decision_date
      FROM scraped_data
    `);

    allData.push(...rows);
    await db.close();
  }

  return allData;
}
