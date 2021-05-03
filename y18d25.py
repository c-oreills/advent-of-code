"""
--- Day 25: Four-Dimensional Adventure ---
The reindeer's symptoms are getting worse, and neither you nor the
white-bearded man have a solution. At least the reindeer has a warm place to
rest: a small bed near where you're sitting.

As you reach down, the reindeer looks up at you, accidentally bumping a button
on your wrist-mounted device with its nose in the process - a button labeled
"help".

"Hello, and welcome to the Time Travel Support Hotline! If you are lost in time
and space, press 1. If you are trapped in a time paradox, press 2. If you need
help caring for a sick reindeer, press 3. If you--"

Beep.

A few seconds later, you hear a new voice. "Hello; please state the nature of
your reindeer." You try to describe the situation.

"Just a moment, I think I can remotely run a diagnostic scan." A beam of light
projects from the device and sweeps over the reindeer a few times.

"Okay, it looks like your reindeer is very low on magical energy; it should
fully recover if we can fix that. Let me check your timeline for a source....
Got one. There's actually a powerful source of magical energy about 1000 years
forward from you, and at roughly your position, too! It looks like... hot
chocolate? Anyway, you should be able to travel there to pick some up; just
don't forget a mug! Is there anything else I can help you with today?"

You explain that your device isn't capable of going forward in time. "I... see.
That's tricky. Well, according to this information, your device should have the
necessary hardware to open a small portal and send some hot chocolate back to
you. You'll need a list of fixed points in spacetime; I'm transmitting it to
you now."

"You just need to align your device to the constellations of fixed points so
that it can lock on to the destination and open the portal. Let me look up how
much hot chocolate that breed of reindeer needs."

"It says here that your particular reindeer is-- this can't be right, it says
there's only one like that in the universe! But THAT means that you're--" You
disconnect the call.

The list of fixed points in spacetime (your puzzle input) is a set of
four-dimensional coordinates. To align your device, acquire the hot chocolate,
and save the reindeer, you just need to find the number of constellations of
points in the list.

Two points are in the same constellation if their manhattan distance apart is
no more than 3 or if they can form a chain of points, each a manhattan distance
no more than 3 from the last, between the two of them. (That is, if a point is
close enough to a constellation, it "joins" that constellation.) For example:

 0,0,0,0
 3,0,0,0
 0,3,0,0
 0,0,3,0
 0,0,0,3
 0,0,0,6
 9,0,0,0
12,0,0,0

In the above list, the first six points form a single constellation: 0,0,0,0 is
exactly distance 3 from the next four, and the point at 0,0,0,6 is connected to
the others by being 3 away from 0,0,0,3, which is already in the constellation.
The bottom two points, 9,0,0,0 and 12,0,0,0 are in a separate constellation
because no point is close enough to connect them to the first constellation.
So, in the above list, the number of constellations is 2. (If a point at
6,0,0,0 were present, it would connect 3,0,0,0 and 9,0,0,0, merging all of the
points into a single giant constellation instead.)

In this example, the number of constellations is 4:

-1,2,2,0
0,0,2,-2
0,0,0,-2
-1,2,0,0
-2,-2,-2,2
3,0,2,-1
-1,3,2,2
-1,0,-1,0
0,2,1,-2
3,0,0,0
In this one, it's 3:

1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2
Finally, in this one, it's 8:

1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2
The portly man nervously strokes his white beard. It's time to get that hot
chocolate.

How many constellations are formed by the fixed points in spacetime?
"""

from collections import defaultdict
import itertools
import functools
import logging

logging.basicConfig()
logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)


def parse_point(s):
    return tuple(int(n) for n in s.strip().split(","))


def parse_points(lines):
    return [parse_point(l) for l in lines]


class Grouper:
    def __init__(self):
        self.groups_by_id = defaultdict(list)
        self.members_to_group_ids = {}
        self._group_id_iter = itertools.count()

    def add_member_to_group(self, member, group_id=None):
        if group_id is None:
            group_id = next(self._group_id_iter)

        assert (
            member not in self.members_to_group_ids
        ), f"{member} has already been added to group"

        logger.debug(f"add_member_to_group {member} {group_id}")

        self.groups_by_id[group_id].append(member)
        self.members_to_group_ids[member] = group_id

    def get_group_id(self, member):
        return self.members_to_group_ids.get(member)

    def combine_groups(self, *group_ids):
        new_group_id = min(group_ids)
        assert len(group_ids) == len(
            set(group_ids)
        ), f"Duplicate group_ids: {group_ids}"

        for group_id in group_ids:
            if group_id == new_group_id:
                continue
            for member in self.groups_by_id[group_id]:
                self.members_to_group_ids[member] = new_group_id
            self.groups_by_id[new_group_id].extend(self.groups_by_id.pop(group_id))

        logger.debug(f"combine_groups {group_ids} -> {new_group_id}")

        return new_group_id


@functools.lru_cache
def manhattan_neighbourhood_offsets(max_distance):
    offsets = []
    for x_d in range(-max_distance, max_distance + 1):
        for y_d in range(-max_distance, max_distance + 1):
            for z_d in range(-max_distance, max_distance + 1):
                for a_d in range(-max_distance, max_distance + 1):
                    if sum(abs(c) for c in (x_d, y_d, z_d, a_d)) <= max_distance:
                        offsets.append((x_d, y_d, z_d, a_d))
    return offsets


def neighbourhood(point):
    (x, y, z, a) = point
    for x_d, y_d, z_d, a_d in manhattan_neighbourhood_offsets(3):
        yield (x + x_d, y + y_d, z + z_d, a + a_d)


def find_num_constellations(points):
    points = list(points)
    assert len(points) == len(set(points)), "Points cannot be duplicate"

    grouper = Grouper()

    for point in points:
        neighbour_group_ids = {
            group_id
            for n in neighbourhood(point)
            if (group_id := grouper.get_group_id(n)) is not None
        }
        if neighbour_group_ids:
            new_group_id = grouper.combine_groups(*neighbour_group_ids)
            grouper.add_member_to_group(point, new_group_id)
        else:
            grouper.add_member_to_group(point, group_id=None)

    logger.debug(grouper.groups_by_id)
    return len(grouper.groups_by_id)


def run_test_cases():
    assert (
        find_num_constellations(
            parse_points(
                """
                0,0,0,0
                3,0,0,0
                0,3,0,0
                0,0,3,0
                0,0,0,3
                0,0,0,6
                9,0,0,0
                12,0,0,0
                """.strip().split()
            )
        )
        == 2
    )

    assert (
        find_num_constellations(
            parse_points(
                """
                -1,2,2,0
                0,0,2,-2
                0,0,0,-2
                -1,2,0,0
                -2,-2,-2,2
                3,0,2,-1
                -1,3,2,2
                -1,0,-1,0
                0,2,1,-2
                3,0,0,0
                """.strip().split()
            )
        )
        == 4
    )

    assert (
        find_num_constellations(
            parse_points(
                """
                1,-1,0,1
                2,0,-1,0
                3,2,-1,0
                0,0,3,1
                0,0,-1,-1
                2,3,-2,0
                -2,2,0,0
                2,-2,0,-1
                1,-1,0,-1
                3,2,0,2
                """.strip().split()
            )
        )
        == 3
    )

    assert (
        find_num_constellations(
            parse_points(
                """
                1,-1,-1,-2
                -2,-2,0,1
                0,2,1,3
                -2,3,-2,1
                0,2,3,-2
                -1,-1,1,-2
                0,-2,-1,0
                -2,2,3,-1
                1,2,2,0
                -1,-2,0,-2
                """.strip().split()
            )
        )
        == 8
    )


run_test_cases()


print(find_num_constellations(parse_points(open("inputs/y18d25", "r").readlines())))
