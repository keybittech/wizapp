import fs from 'fs';
import path from "path";
import { Statements } from "../lib/types";

interface ModificationRules {
  type: string;
  action: 'add' | 'edit' | 'delete';
  newText?: string;
  addBeforeText?: string;
  addAfterText?: string;
}

export function createModificationsFunction(): (statement: Statements) => Statements | null {
  
  const rules = JSON.parse(fs.readFileSync(path.join(__dirname, '../files/mods'), { encoding: 'utf-8' }).toString()) as ModificationRules[];
  
  return (statement: Statements) => {
    const rule = rules.find((r) => r.type === statement.type);

    if (!rule) {
      return statement;
    }

    switch (rule.action) {
      case 'add':
        return {
          type: statement.type,
          text: rule.addBeforeText + statement.text + rule.addAfterText,
        };
      case 'edit':
        return {
          type: statement.type,
          text: rule.newText!,
        };
      case 'delete':
        return null;
      default:
        return statement;
    }
  };
}