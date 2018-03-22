import { pget } from "utils/request";

export function loadVideoCourses() {
  return pget(`/rise/video/course/load/all`)
}
