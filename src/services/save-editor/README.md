
Mobx cannot seem to save anything.

### Attempt 1
We cannot make our existing object observable, we must deep clone it into a new observable object.
Upon doing this, we must change it back with toJS, which when used on our save state causes the browser to freeze.  This
occurs even with small files.

### Attempt 2
Creating wrapper objects is problematic for behaviors, as they have deep objects that we have to track.  mobx
does not provide a means of observing deep changes, just all-changes and single-object changes.  This prevents us
from keeping our backing object in sync.

### Attempt 3
Created a sync function on all models to call before save.  This still fails, as toJS will turn an observable
map into a simple object, rather than an ES Map object.  This in turn causes the parser to fail, as it expects
an ES map.  We cannot have the parser use objects, as the keys are often complex objects in their own right.
