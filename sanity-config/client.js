import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';


export const client = createClient({
  projectId: "u5bqbou3", // replace with your actual project ID
  dataset: "recipe",
  apiVersion: "2023-05-03",
  useCdn: false,
});

// Create an image URL builder instance
export const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export function urlFor(source) {
  return builder.image(source);
}