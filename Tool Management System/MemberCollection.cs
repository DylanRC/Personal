using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAB301_Assignment
{
    class MemberCollection
    {
        private int number;
        private BSTree memberTree = new BSTree();

        int Number // get the number of members in the community library
        {
            get { return number; }
        }

        public void add(Member aMember) //add a new member to this member collection, make sure there are no duplicates in the member collection
        {
            memberTree.Insert(aMember);
            number += 1;
        }

        public void delete(Member aMember) //delete a given member from this member collection, a member can be deleted only when the member currently is not holding any tool
        {
            memberTree.Delete(aMember);
            number -= 1;
        }

        public Boolean search(Member aMember) //search a given member in this member collection. Return true if this memeber is in the member collection; return false otherwise.
        {
            return memberTree.Search(aMember);
        }

        public Member[] toArray() //output the memebers in this collection to an array of iMember
        {
            return memberTree.MemberList.ToArray();
        }
    }
}
