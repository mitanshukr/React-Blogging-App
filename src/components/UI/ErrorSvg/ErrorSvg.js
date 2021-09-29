import Error400 from "./Errors/Error400";
import Error401 from "./Errors/Error401";
import Error403 from "./Errors/Error403";
import Error404 from "./Errors/Error404";
import Error500 from "./Errors/Error500";
import Error404SinglePost from "./Errors/Error404SinglePost";
import NetworkError from "./Errors/NetworkError";
import SomethingWentWrong from "./Errors/SomethingWentWrong";

const ErrorSvg = (props) => {
  if (props.status === 400) {
    return <Error400 />;
  } else if (props.status === 401) {
    return <Error401 />;
  } else if (props.status === 403) {
    return <Error403 />;
  } else if (props.status === 404) {
    if (props.src === "SINGLE_POST") {
      return <Error404SinglePost />;
    } else {
      return <Error404 />;
    }
  } else if (props.status === 500) {
    return <Error500 />;
  } else if (props.status === -1) {
    return <NetworkError />;
  } else {
    return <SomethingWentWrong />;
  }
};

export default ErrorSvg;
