import { Route } from "react-router";
import AuthRoute from "../../../hoc/AuthRoute";
import GetSinglePost from "./GetSinglePost";

const GetSinglePostRouter = (props) => {
  const isPrivate = props.history?.location?.state?.isPrivate === true;
  return isPrivate ? (
    <AuthRoute path="/post/:postId" exact>
      <GetSinglePost />
    </AuthRoute>
  ) : (
    <Route path="/post/:postId" exact>
      <GetSinglePost />
    </Route>
  );
};

export default GetSinglePostRouter;
