/**
 * SpriteSheet utility for extracting individual avatars from a sprite sheet
 */
export class SpriteSheet {
  constructor(src, spriteWidth, spriteHeight, cols, rows) {
    this.image = new Image();
    this.image.src = src;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.cols = cols;
    this.rows = rows;
    this.totalSprites = cols * rows;
  }

  // Get the CSS for a specific sprite by index
  getSpriteCss(index) {
    if (index >= this.totalSprites) {
      console.error('Sprite index out of bounds');
      return {};
    }

    const row = Math.floor(index / this.cols);
    const col = index % this.cols;

    return {
      backgroundImage: `url(${this.image.src})`,
      backgroundPosition: `-${col * this.spriteWidth}px -${row * this.spriteHeight}px`,
      width: `${this.spriteWidth}px`,
      height: `${this.spriteHeight}px`,
      backgroundSize: `${this.cols * this.spriteWidth}px ${this.rows * this.spriteHeight}px`
    };
  }

  // Create a data URL for a specific sprite by index
  async getSpriteDataUrl(index) {
    return new Promise((resolve) => {
      if (!this.image.complete) {
        this.image.onload = () => {
          resolve(this.createDataUrl(index));
        };
      } else {
        resolve(this.createDataUrl(index));
      }
    });
  }

  createDataUrl(index) {
    if (index >= this.totalSprites) {
      console.error('Sprite index out of bounds');
      return null;
    }

    const row = Math.floor(index / this.cols);
    const col = index % this.cols;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.spriteWidth;
    canvas.height = this.spriteHeight;

    ctx.drawImage(
      this.image,
      col * this.spriteWidth, 
      row * this.spriteHeight, 
      this.spriteWidth, 
      this.spriteHeight,
      0, 
      0, 
      this.spriteWidth, 
      this.spriteHeight
    );

    return canvas.toDataURL('image/png');
  }
}

// Example usage:
// const avatarSheet = new SpriteSheet('/avatars.jpg', 64, 64, 5, 4);