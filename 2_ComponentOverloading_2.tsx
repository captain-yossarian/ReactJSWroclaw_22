import { FC } from "react";
/**
 * Article: https://dev.to/captainyossarian/how-to-type-react-props-as-a-pro-2df2
 */

type WithState = { active: boolean };

type WithPath = { path: string };

/**
 * Added -----> withRouter?: never;
 */
type WithStateProps = { withRouter?: never; tabs: WithState[] };

type WithRouterProps = {
  withRouter: true;
  baseUrl?: string;
  tabs: WithPath[];
};

const TabsWithRouter: FC<WithRouterProps> = (props) => null;
const TabsWithState: FC<WithStateProps> = (props) => null;

type TabsProps = WithStateProps | WithRouterProps;

const Tabs = (props: TabsProps) =>
  props.withRouter
    ? <TabsWithRouter {...props} />
    : <TabsWithState {...props} />

    /* Should be error because of lack of withRouter */
const Test = () => <Tabs baseUrl="something" tabs={[{ active: true }]} />;
;