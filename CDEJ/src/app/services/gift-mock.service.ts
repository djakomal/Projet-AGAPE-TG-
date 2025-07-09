import { Injectable } from '@angular/core';
import { Gift } from '../models/gift.model';

@Injectable({ providedIn: 'root' })
export class GiftMockService {
  private gifts: Gift[] = [
    { id: '1', enfantId: '1', parrainId: '1', description: 'Livre de contes', date: new Date('2024-01-15') },
    { id: '2', enfantId: '3', parrainId: '2', description: 'Ballon de foot', date: new Date('2024-02-10') },
  ];

  getByEnfant(enfantId: string): Gift[] {
    return this.gifts.filter(g => g.enfantId === enfantId);
  }

  add(gift: Gift): void {
    this.gifts.push(gift);
  }
} 