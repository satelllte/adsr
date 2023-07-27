type PageElementContainerProps = {
  children: React.ReactNode;
};

export function PageElementContainer({children}: PageElementContainerProps) {
  return <div className='mx-4'>{children}</div>;
}
