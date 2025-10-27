import { FaFileImage } from "react-icons/fa6";
import { MdAudioFile } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { BiSolidFileDoc } from "react-icons/bi";
import { AiFillFileText } from "react-icons/ai";
import { TbFileUnknown } from "react-icons/tb";
import { TbFavicon } from "react-icons/tb";

export default function CompFileIcon({ ext }) {
  if (
    [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"].includes(ext)
  ) {
    return <FaFileImage />;
  }
  if ([".mp3", ".wav", ".ogg", ".flac", ".aac"].includes(ext)) {
    return <MdAudioFile />;
  }
  if ([".mp4", ".avi", ".mov", ".mkv", ".webm"].includes(ext)) {
    return <FaFileVideo />;
  }
  if ([".pdf"].includes(ext)) {
    return <FaFilePdf />;
  }
  if ([".doc", ".docx"].includes(ext)) {
    return <BiSolidFileDoc />;
  }
  if ([".txt", ".md", ".json", ".csv"].includes(ext)) {
    return <AiFillFileText />;
  }
  if ([".ico"].includes(ext)) {
    return <TbFavicon />;
  }
  return <TbFileUnknown />;
}
