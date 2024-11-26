import Dexie, { Table } from 'dexie';

// Define the type for settings
export type Settings = {
  id: number; // Primary key
  sortOrder: 'asc' | 'desc';
  showArchived: boolean;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  token: string | null;
};

export const defaultSettings: Settings = {
  id: 1,
  sortOrder: 'desc',
  showArchived: false,
  theme: 'dark',
  notificationsEnabled: true,
  token: null
}

// Define the database class
class AppDatabase extends Dexie {
  settings!: Table<Settings>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      // Primary key `id`, no need for indexes as we only have a single record
      settings: 'id',
    });

    // Seed default settings if not already set
    this.on('populate', () => {
      this.settings.add(defaultSettings);
    });
  }

  // Method to update settings
  async updateSettings(newSettings: Partial<Settings>) {
    await this.settings.update(1, newSettings);
  }

  // Method to get settings
  async getSettings(): Promise<Settings> {
    return this.settings.get(1) as Promise<Settings>;
  }
}

// Instantiate the database
export const db = new AppDatabase();
