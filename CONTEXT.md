# kpfc Front Context

This context defines the domain language for the kpfc frontend. It exists so product flows and architectural seams use the same terms.

## Language

**Deck**:
A collection of Cards owned by a User and studied as a unit.
Avoid: set, folder

**Card**:
A study prompt with review state that belongs to exactly one Deck.
Avoid: item, flash

**Study Session**:
A user-driven run through Cards from one Deck, with local progress that can outlive server availability.
Avoid: quiz, round, review flow

**Review**:
A quality score recorded for one Card during a Study Session.
Avoid: answer, grade event

## Relationships

- A **Deck** contains zero or more **Cards**
- A **Study Session** belongs to exactly one **Deck**
- A **Study Session** records one or more **Reviews**
- A **Review** belongs to exactly one **Card**

## Example dialogue

> **Dev:** "If the server drops during a **Study Session**, do we keep each **Review**?"
> **Domain expert:** "Yes. The **Study Session** keeps local progress first and syncs each **Review** later."

## Flagged ambiguities

- "study" was used to mean both the screen and the domain flow; resolved: the screen is an adapter for a **Study Session**.
