import { FC } from "react";
/**
 * Article: https://dev.to/captainyossarian/how-to-type-react-props-as-a-pro-2df2
 */

type WithState = { active: boolean };

type WithPath = { path: string };

type WithStateProps = { tabs: WithState[] };

type WithRouterProps = {
  withRouter: true;
  baseUrl?: string;
  tabs: WithPath[];
};

const TabsWithRouter: FC<WithRouterProps> = (props) => null;
const TabsWithState: FC<WithStateProps> = (props) => null;

type TabsProps = WithStateProps | WithRouterProps;

const hasProperty = <Obj, Prop extends string>(
  obj: Obj,
  prop: Prop
): obj is Obj & Record<Prop, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, prop);

// type Overloading =
//   & ((props: WithStateProps) => JSX.Element)
//   & ((props: WithRouterProps) => JSX.Element)
const Tabs: FC<WithStateProps> & FC<WithRouterProps> = (props: TabsProps) =>
  hasProperty(props, "withRouter") ? (
    <TabsWithRouter {...props} />
  ) : (
    <TabsWithState {...props} />
  );

const Test = () => (
  <div>
    {/* Without errors */}
    <Tabs withRouter tabs={[{ path: "somepath" }]} />
    <Tabs // With correct state props
      tabs={[{ active: true }]}
    />
    <Tabs withRouter baseUrl="someurl" tabs={[{ path: "somepath" }]} />

    {/* With expected errors*/}
    <Tabs // With incorrect state props
      baseUrl="something"
      tabs={[{ active: true }]}
    />
    <Tabs // WIth incorrect router props
      withRouter
      tabs={[{ active: true }]}
    />
  </div>
);