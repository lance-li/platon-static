import { pget } from "utils/request";

export function loadVideoCourse(id) {
  return pget(`/rise/video/course/load/${id}`)
}
