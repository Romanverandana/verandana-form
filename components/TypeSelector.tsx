'use client';
import Image from 'next/image';
import { TileData } from '../lib/types';
import styles from '../app/page.module.css';

interface TypeSelectorProps {
  tilesData: TileData[];
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string;
  name?: string;
}

export default function TypeSelector({ tilesData, selectedValue, onSelect, error, name }: TypeSelectorProps) {
  return (
    <div>
      <h2 className={styles.sectionTitle}>
        {name ? `${name}, jaki typ Cię interesuje? *` : 'Jaki typ konstrukcji Cię interesuje? *'}
      </h2>
      
      {error && <span className={styles.errorMessage} style={{textAlign: 'center', display: 'block', marginBottom: '15px'}}>{error}</span>}
      <div className={styles.tiles}>
        {tilesData.map(tile => (
          <button
            key={tile.value}
            type="button"
            className={`${styles.tile} ${selectedValue === tile.value ? styles.selected : ""}`}
            onClick={() => onSelect(tile.value)}
            aria-pressed={selectedValue === tile.value}
          >
            <div className={styles.imgWrap}>
              <Image 
                src={tile.src} 
                alt={tile.alt} 
                fill 
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
            <div className={styles.tileTitle}>{tile.title}</div>
            <div className={styles.tileDesc}>{tile.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}