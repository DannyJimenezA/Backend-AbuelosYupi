// category.service.ts
/*
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises'; // para borrar imagen

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<Category>) {
    return this.repo.save(data);
  }

  async update(id: number, data: Partial<Category>) {
  await this.repo.update(id, data);
  return this.repo.findOne({ where: { id } });
}


findOne(id: number) {
  return this.repo.findOne({ where: { id } });
}

}
*/




import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<Category>) {
    return this.repo.save(data);
  }

  async update(id: number, data: Partial<Category>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    // Eliminar imagen del servidor si existe
    if (category.imageUrl) {
      try {
        const imagePath = `.${category.imageUrl}`;
        await unlink(imagePath);
      } catch (err) {
        console.warn(`⚠️ No se pudo eliminar la imagen: ${err.message}`);
      }
    }

    await this.repo.remove(category);
    return { message: `Categoría con ID ${id} eliminada correctamente` };
  }
}
