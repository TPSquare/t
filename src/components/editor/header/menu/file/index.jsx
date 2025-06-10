import Container from "../Container";
import Divider from "../Divider";
import NewOption from "./NewOption";
import OpenOption from "./OpenOption";
import DownloadOption from "./DownloadOption";

export default function FileMenu() {
  return (
    <Container title="File">
      <NewOption />
      <OpenOption />
      <Divider />
      <DownloadOption />
    </Container>
  );
}
