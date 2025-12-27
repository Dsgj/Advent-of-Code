# --- Day 12: Christmas Tree Farm ---

You're almost out of time, but there can't be much left to decorate. Although there are no stairs, elevators, escalators, tunnels, chutes, teleporters, firepoles, or conduits here that would take you deeper into the North Pole base, there is a ventilation duct. You jump in.

After bumping around for a few minutes, you emerge into a large, well-lit cavern full of Christmas trees!

There are a few Elves here frantically decorating before the deadline. They think they'll be able to finish most of the work, but the one thing they're worried about is the presents for all the young Elves that live here at the North Pole. It's an ancient tradition to put the presents under the trees, but the Elves are worried they won't fit.

The presents come in a few standard but very weird shapes. The shapes and the regions into which they need to fit are all measured in standard units. To be aesthetically pleasing, the presents need to be placed into the regions in a way that follows a standardized two-dimensional unit grid; you also can't stack presents.

As always, the Elves have a summary of the situation (your puzzle input) for you. First, it contains a **list of the presents' shapes**. Second, it contains the **size of the region** under each tree and a **list of the number of presents** of each shape that need to fit into that region.

## Example Input

```
0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
```

## Input Format

The first section lists the **standard present shapes**. For convenience, each shape starts with its index and a colon; then, the shape is displayed visually, where `#` is part of the shape and `.` is not.

The second section lists the **regions under the trees**. Each line starts with the width and length of the region; `12x5` means the region is **12 units wide** and **5 units long**. The rest of the line describes the presents that need to fit into that region by listing the quantity of each shape of present; `1 0 1 0 3 2` means:

- **1** present with shape index 0
- **0** presents with shape index 1
- **1** present with shape index 2
- **0** presents with shape index 3
- **3** presents with shape index 4
- **2** presents with shape index 5

## Rules

- Presents can be **rotated** and **flipped** as necessary to make them fit
- Presents must be placed **perfectly on the grid**
- Shapes **can't overlap** (the `#` parts from two different presents can't go in the same place)
- Shapes **can fit together** (the `.` part in a present's shape doesn't block another present)

---

## Part 1

The Elves need to know **how many of the regions can fit the presents listed**.

### Example Walkthrough

**First region (4x4)** needs two presents with shape index 4:

```
###
#..
###
```

One way to fit both:

```
AAA.
ABAB
ABAB
.BBB
```

✓ **This region works!**

**Second region (12x5)** needs: 1×shape0, 1×shape2, 2×shape4, 2×shape5

One way to fit all:

```
....AAAFFE.E
.BBBAAFFFEEE
DDDBAAFFCECE
DBBB....CCC.
DDD.....C.C.
```

✓ **This region works!**

**Third region (12x5)** needs: 1×shape0, 1×shape2, 3×shape4, 2×shape5

Unfortunately, no matter how hard you try, there is no way to fit all of the presents into this region.
✗ **This region does NOT work!**

### Example Answer

In the example, **2** regions can fit all of their listed presents.

---

## Part 2

_The Elves thank you profusely for the help and start rearranging the oddly-shaped presents. As you look up, you notice that a lot more Elves have arrived here at the Christmas tree farm._

_In fact, many of these new arrivals look familiar: they're the Elves you helped while decorating the North Pole base. Right on schedule, each group seems to have brought a star to put atop one of the Christmas trees!_

_Before any of them can find a ladder, a particularly large Christmas tree suddenly flashes brightly when a large star magically appears above it! As your eyes readjust, you think you notice a portly man with a white beard disappear into the crowd._

**You go look for a ladder; only 23 stars to go.** ⭐⭐
