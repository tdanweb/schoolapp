// db.js // for storing images
import Dexie from "dexie"; 

export const db = new Dexie("ImageDB")
//export const myImageStore = new Dexie("photoLab")

// table: images, with id as primary key
db.version(1).stores({
  images: "id,data" // id = string, data = Blob
});