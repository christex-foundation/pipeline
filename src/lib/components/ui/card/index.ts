import Root from './card.svelte?inline';
import Content from './card-content.svelte?inline';
import Description from './card-description.svelte?inline';
import Footer from './card-footer.svelte?inline';
import Header from './card-header.svelte?inline';
import Title from './card-title.svelte?inline';

export {
  Root,
  Content,
  Description,
  Footer,
  Header,
  Title,
  //
  Root as Card,
  Content as CardContent,
  Description as CardDescription,
  Footer as CardFooter,
  Header as CardHeader,
  Title as CardTitle,
};

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
