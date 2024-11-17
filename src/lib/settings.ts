// src/lib/settings.ts
import { useEffect, useState } from 'react';

// ログレベルの定義
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// 設定の型定義
export interface Settings {
  logLevel: LogLevel;
}

// デフォルト設定
export const defaultSettings: Settings = {
  logLevel: 'info',
};

// 設定の読み込み
export const loadSettings = async (): Promise<Settings> => {
  if (!chrome.storage || !chrome.storage.sync) {
    console.warn('Chrome storage API not available, using default settings');
    return defaultSettings;
  }

  try {
    const result = await chrome.storage.sync.get('settings');
    if (!result.settings) {
      // 初回起動時は設定を初期化
      await saveSettings(defaultSettings);
      return defaultSettings;
    }
    return result.settings as Settings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
};

// 設定の保存
export const saveSettings = async (settings: Settings): Promise<void> => {
  if (!chrome.storage || !chrome.storage.sync) {
    console.warn('Chrome storage API not available, settings will not persist');
    return;
  }

  try {
    await chrome.storage.sync.set({ settings });
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

// React Hook for settings management
export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        setSettings(savedSettings);
      } catch (err) {
        setError((err as Error).message);
        console.error('Failed to initialize settings:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeSettings();

    // 設定変更の監視
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.settings?.newValue) {
        setSettings(changes.settings.newValue);
      }
    };

    if (chrome.storage?.sync) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError((err as Error).message);
      console.error('Failed to update settings:', err);
    }
  };

  return {
    settings,
    updateSettings,
    loading,
    error,
  };
};