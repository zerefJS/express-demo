import { queryWithParams, query, executeQuery } from '../utils/database.js'
import { ApiError } from './error.services.js'

export class Video {
   #name
   #url
   #poster
   #description
   #categories

   constructor({ name, url, poster, description, categories }) {
      this.#name = name
      this.#url = url
      this.#poster = poster
      this.#description = description || null
      this.#categories = categories || null
   }

   async save() {
      try {
         const isExistVideo = this.#isExistVideo()
         if (isExistVideo) throw new ApiError('Aynı video iki kere kayıt edilemez.', 400)

         const video = await executeQuery(
            'INSERT INTO video (name, url, poster, description, categories) VALUES (?, ?, ?, ?, ?);',
            [this.#name, this.#url, this.#poster, this.#description, this.#categories]
         )

         if (!video.affectedRows) throw new ApiError('Video created failed')
      } catch (err) {
         throw err
      }
   }

   async #isExistVideo() {
      const [isExistVideo] = await Video.findByUrl(this.#url)
      console.log(
         '🚀 ~ file: video.services.js:37 ~ Video ~ #isExistVideo ~ isExistVideo:',
         isExistVideo
      )
      return isExistVideo !== null
   }

   static async findMany() {
      return await query('SELECT * FROM video LIMIT 50;')
   }


   static async paginate(pageNumber) {
      const perPageNumber = (pageNumber - 1) * 10
      return await queryWithParams(
         'SELECT * FROM video ORDER BY created_at DESC LIMIT 10 OFFSET ?;',
         [perPageNumber]
      )
   }

   static async findByUrl(url) {
      return await queryWithParams('SELECT * FROM video WHERE url = ? LIMIT 1;', [url])
   }
}
