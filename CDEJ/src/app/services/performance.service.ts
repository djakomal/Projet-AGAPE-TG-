import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SectorStats {
  social: number;
  medical: number;
  comptable: number;
}

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  private statsSubject = new BehaviorSubject<SectorStats>({
    social: 0,
    medical: 0,
    comptable: 0
  });

  setStat(role: 'social' | 'medical' | 'comptable', value: number) {
    const current = this.statsSubject.value;
    this.statsSubject.next({ ...current, [role]: value });
  }

  getAllStats() {
    return this.statsSubject.asObservable();
  }

  getGlobalProgression(): number {
    const { social, medical, comptable } = this.statsSubject.value;
    return Math.round((social + medical + comptable) / 3);
  }
} 