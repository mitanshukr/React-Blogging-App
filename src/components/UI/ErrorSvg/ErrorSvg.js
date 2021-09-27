import _400 from "./Errors/_400";
import _401 from "./Errors/_401";
import _403 from "./Errors/_403";
import _404 from "./Errors/_404";
import _500 from "./Errors/_500";
import _503 from "./Errors/_503";
import _404_SinglePost from "./Errors/_404_SinglePost";
import SomethingWentWrong from "./Errors/SomethingWentWrong";

const ErrorSvg = (props) => {
  if (props.status === 400) {
    return <_400 />;
  } else if (props.status === 401) {
    return <_401 />;
  } else if (props.status === 403) {
    return <_403 />;
  } else if (props.status === 404) {
    if (props.src === "SINGLE_POST") {
      return <_404_SinglePost />;
    } else {
      return <_404 />;
    }
  } else if (props.status === 500) {
    return <_500 />;
  } else if (props.status === -1) {
    return <_503 />;
  } else {
    return <SomethingWentWrong />;
  }
};

export default ErrorSvg;
