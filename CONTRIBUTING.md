# Contributing to Axel

So you've decided to contribute to Axel. Excellent!

## Using the issue tracker

The [issue tracker](https://github.com/ezrael-git/Axel/issues) is the heart of Axel's work. Use it for bugs, questions, proposals and feature requests.

Please always **open a new issue before sending a pull request** if you want to add a new feature to Crystal, unless it is a minor fix, and wait until someone from the core team approves it before you actually start working on it. Otherwise, you risk having the pull request rejected, and the effort implementing it goes to waste. And if you start working on an implementation for an issue, please **let everyone know in the comments** so someone else does not start working on the same thing.

Regardless of the kind of issue, please make sure to look for similar existing issues before posting; otherwise, your issue may be flagged as `duplicated` and closed in favour of the original one. Also, once you open a new issue, please make sure to honour the items listed in the issue template.

If you open a question, remember to close the issue once you are satisfied with the answer and you think
there's no more room for discussion. We'll anyway close the issue after some days.

If something is missing from the language it might be that it's not yet implemented or that it was purposely left out. If in doubt, just ask.

### Labels

Issue tracker labels are sorted by category: community, kind, pr, status and topic.

#### Community

These are the issues where help from the community is most welcome. See above for a description on `newcomer`, `to-research`, `to-design`, `to-implement` and `to-document`.

Label `in-progress` is used to signal that someone from the community is already working on the issue (since Github does not allow for a non-team member to be _assigned_ to an issue).

The label `axe-idea` refers to a feature proposal that, albeit good, is better suited as a separate shard rather than as part of the core library; so if you are looking for a shard of your own to start working on, these issues are good starting points.

#### Kind

The most basic category is the kind of the issue: `bug`, `feature` and `question` speak for themselves, while `refactor` is left for changes that do not actually introduce a new a feature, and are not fixing something that is broken, but rather clean up the code (or documentation!).

#### PR

Pull-request only labels, used to signal that a pull request `needs-review` by a core team member, or that is still `wip` (work in progress).

#### Topic

Topic encompasses the broad aspect of the language that the issue refers to: could be performance, the compiler, the type system, the code formatter, concurrency, and quite a large etc.

#### Status

Status labels attempt to capture the lifecycle of an issue:

* A detailed proposal on a feature is marked as `draft`, while a more general argument is usually labelled as `discussion` until a consensus is achieved.

* An issue is `accepted` when it describes a feature or bugfix that a core team member has agreed to have added to the language, so as soon as a design is discussed (if needed), it's safe to start working on a pull request.

* Bug reports are marked as `needs-more-info`, where the author is requested to provide the info required; note that the issue may be closed after some time if it is not supplied.

* Issues that are batched in an epic to be worked on as a group are typically marked as `deferred`, while low-prio issues or tasks far away in the roadmap are marked as `someday`.

* Closed issues are marked as `implemented`, `invalid`, `duplicate` or `wontfix`, depending on their resolution.

