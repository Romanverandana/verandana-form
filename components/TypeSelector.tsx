'use client';
import Image from 'next/image';
import { TileData } from '@/lib/types';
import styles from '@/app/page.module.css';

interface TypeSelectorProps {
  tilesData: TileData[];
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string;
}

export default function TypeSelector({ tilesData, selectedValue, onSelect, error }: TypeSelectorProps) {
  return (
    <div>
      <div className={styles.sectionTitle}>Wybierz typ konstrukcji, który Cię interesuje *</div>
      {error && <span className={styles.errorMessageCentered}>{error}</span>}
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
                style={{ objectFit: 'cover' }}
                sizes="180px"
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
