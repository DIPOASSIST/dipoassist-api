import { InteractiveImageType } from '../../validator/interactive-image/interactiveImageValidator';

export interface CreateInteractiveImageProps extends InteractiveImageType {
  image_url: Express.Multer.File;
}

export interface UpdateInteractiveImageProps extends InteractiveImageType {
  image_url?: Express.Multer.File;
}
