export type NoteMeta = {
  name: string;
  link: string;
  image_url: string;
};

export type GenerateFormValues = {
  prompt: string;
  image?: File;
};
