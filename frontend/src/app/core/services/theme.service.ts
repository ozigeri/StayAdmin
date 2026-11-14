import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'stayadmin_theme';
  readonly isDark = signal<boolean>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const dark = this.isDark();
      if (typeof document !== 'undefined') {
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        try {
          localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
        } catch {}
      }
    });
  }

  private getInitialTheme(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  }

  toggleTheme(): void {
    this.isDark.update((v) => !v);
  }
}
