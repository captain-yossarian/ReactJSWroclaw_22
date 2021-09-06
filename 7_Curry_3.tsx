import React, { FC, ComponentType } from "react";

/**
 * Article: https://catchts.com/currying-components#typing_factory
 */

type EnumerableComponentFactory = <I>(config: {
  Container: FC<{ children: JSX.Element[] }>;
  Item: ComponentType<I>;
}) => FC<{ items: I[] }>;

const Enumerable: EnumerableComponentFactory =
  ({ Container, Item }) =>
  ({ items }) =>
    (
      <Container>
        {items.map((props, index) => (
          <Item key={index} {...props} />
        ))}
      </Container>
    );

const UnorderedList = Enumerable({
  Container: ({ children }) => <ul>{children}</ul>,
  Item: ({ title }: { title: string }) => <li>{title}</li>,
});

const result = <UnorderedList items={[{ title: "Something" }]} />;
