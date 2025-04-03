import { Command as CommandPrimitive } from 'cmdk-sv';

import Root from './command.svelte?inline';
import Dialog from './command-dialog.svelte?inline';
import Empty from './command-empty.svelte?inline';
import Group from './command-group.svelte?inline';
import Item from './command-item.svelte?inline';
import Input from './command-input.svelte?inline';
import List from './command-list.svelte?inline';
import Separator from './command-separator.svelte?inline';
import Shortcut from './command-shortcut.svelte?inline';

const Loading = CommandPrimitive.Loading;

export {
  Root,
  Dialog,
  Empty,
  Group,
  Item,
  Input,
  List,
  Separator,
  Shortcut,
  Loading,
  //
  Root as Command,
  Dialog as CommandDialog,
  Empty as CommandEmpty,
  Group as CommandGroup,
  Item as CommandItem,
  Input as CommandInput,
  List as CommandList,
  Separator as CommandSeparator,
  Shortcut as CommandShortcut,
  Loading as CommandLoading,
};
