import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from 'moment';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {
    const wrapper = mount(Posts, {router, store, localVue});

    it('testingPostNumbers', function () {
        let posts = wrapper.findAll('.post');
        expect(testData.length).toEqual(posts.length);
    });

    it('test media type', function (){
        let posts = wrapper.findAll('.post');
        for (let index = 0; index < posts.length; index++) {
            const element = posts.at(index);
            if(element.contains('.post-image')){
               if(wrapper.vm.posts[index].media.type =='image'){
                   expect(element.contains('.post-image img')).toBe(true)
               }
              else if(wrapper.vm.posts[index].media.type =='video'){
                expect(element.contains('.post-image video')).toBe(true)
            }
                
            }
           else{
               expect(!element.contains('.post-image')).toBe(true);
           }
            
        }
    });

    it('test date format', function (){
        let posts = wrapper.findAll('.post');
        for (let index = 0; index < posts.length; index++) {
            const post = posts.at(index);
            let date = wrapper.vm.posts[index].createTime
            let formatted = moment(date).format('LLLL')
            let ogdate = wrapper.find('.post-author > small').text();
            expect(formatted).toEqual(ogdate);
        }

    });


});

