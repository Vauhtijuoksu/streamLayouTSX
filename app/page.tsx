import {themes} from "@/themes/list";

export default function Home() {
  return (
    <div>
      <ul>
        {Object.keys(themes).map((t, i) => {return <li key={i}>{t}</li>})}
      </ul>
    </div>
  );
}
